import express from 'express';
import ICAL from 'ical.js';
import VCardParser from 'vcard-parser';
import fs from 'fs';
import path from 'path';

const router = express.Router();

// Parse ICS (calendar) file
router.post('/parse-ics', (req, res) => {
  try {
    const { fileId } = req.body;
    const filePath = path.join(process.cwd(), 'uploads', fileId);

    if (!fs.existsSync(filePath)) {
      return res.status(404).json({ error: 'File not found' });
    }

    const icsData = fs.readFileSync(filePath, 'utf8');
    const jcalData = ICAL.parse(icsData);
    const comp = new ICAL.Component(jcalData);

    const events = [];
    const vevents = comp.getAllSubcomponents('vevent');

    for (const vevent of vevents) {
      const event = new ICAL.Event(vevent);

      events.push({
        summary: event.summary,
        description: event.description,
        location: event.location,
        startDate: event.startDate?.toJSDate(),
        endDate: event.endDate?.toJSDate(),
        organizer: event.organizer,
        attendees: event.attendees?.map(a => a.toString()),
        uid: event.uid
      });
    }

    res.json({ events });
  } catch (error) {
    console.error('ICS parse error:', error);
    res.status(500).json({ error: error.message });
  }
});

// Parse VCF (vCard/contacts) file
router.post('/parse-vcf', (req, res) => {
  try {
    const { fileId } = req.body;
    const filePath = path.join(process.cwd(), 'uploads', fileId);

    if (!fs.existsSync(filePath)) {
      return res.status(404).json({ error: 'File not found' });
    }

    const vcfData = fs.readFileSync(filePath, 'utf8');
    const parsed = VCardParser.parse(vcfData);

    const contacts = parsed.map(card => {
      const data = {};
      for (const prop of card) {
        data[prop.key.toLowerCase()] = prop.value;
      }
      return {
        name: data.fn,
        email: data.email,
        phone: data.tel,
        organization: data.org,
        title: data.title,
        address: data.adr,
        birthday: data.bday,
        note: data.note,
        url: data.url
      };
    });

    res.json({ contacts });
  } catch (error) {
    console.error('VCF parse error:', error);
    res.status(500).json({ error: error.message });
  }
});

export default router;
