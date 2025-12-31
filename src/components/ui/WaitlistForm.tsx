import { useState, type FormEvent } from 'react';
import Button from './Button';
import { CheckCircle } from 'lucide-react';

const WaitlistForm = () => {
  const [email, setEmail] = useState('');
  const [submitted, setSubmitted] = useState(false);

  const handleSubmit = (e: FormEvent) => {
    e.preventDefault();
    // Here you would typically send the email to your backend
    setSubmitted(true);
  };

  if (submitted) {
    return (
      <div className="bg-green-50 border border-green-200 rounded-xl p-8 text-center">
        <CheckCircle className="w-16 h-16 text-green-600 mx-auto mb-4" />
        <h3 className="text-2xl font-bold text-green-900 mb-2">You're on the list!</h3>
        <p className="text-green-700">
          We'll notify you as soon as this feature launches. Check your email for confirmation.
        </p>
      </div>
    );
  }

  return (
    <form onSubmit={handleSubmit} className="max-w-md mx-auto">
      <div className="flex flex-col sm:flex-row gap-4">
        <input
          type="email"
          placeholder="Enter your email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          required
          className="flex-1 px-6 py-4 border-2 border-ui-border rounded-lg focus:border-accent-primary focus:outline-none transition-colors text-text-primary"
        />
        <Button type="submit" variant="primary" size="large">
          Join Waitlist
        </Button>
      </div>
      <p className="text-sm text-text-secondary mt-3 text-center">
        We'll never share your email. Unsubscribe anytime.
      </p>
    </form>
  );
};

export default WaitlistForm;
