
import React, { useState } from 'react';
import { Send, PhoneCall, Mail, MapPin } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { useToast } from '@/hooks/use-toast';
import PageLayout from '@/components/Layout/PageLayout';

const Contact = () => {
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [phone, setPhone] = useState('');
  const [message, setMessage] = useState('');
  const [eventType, setEventType] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const { toast } = useToast();

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!name || !message) {
      toast({
        title: "Missing Information",
        description: "Please fill out all required fields.",
        variant: "destructive"
      });
      return;
    }
    
    setIsSubmitting(true);
    
    // This would connect to backend service in the real implementation
    // Simulate submission delay
    setTimeout(() => {
      setIsSubmitting(false);
      toast({
        title: "Message Sent!",
        description: "We'll get back to you as soon as possible.",
      });
      
      // Clear form
      setName('');
      setEmail('');
      setPhone('');
      setMessage('');
      setEventType('');
    }, 1500);
  };

  return (
    <PageLayout>
      <div className="min-h-screen bg-gradient-to-b from-black via-karaoke-purple to-karaoke-pink text-white p-4">
        <div className="max-w-6xl mx-auto">
          <div className="text-center mb-8">
            <h1 className="text-4xl font-extrabold gradient-text mb-2">Contact Us</h1>
            <p className="text-xl">Get in touch to book an event or ask questions</p>
          </div>
          
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
            <div className="bg-black/40 rounded-xl shadow-lg p-6">
              <h2 className="text-2xl font-bold mb-6">Send Us A Message</h2>
              
              <form onSubmit={handleSubmit} className="space-y-6">
                <div>
                  <label htmlFor="name" className="block text-sm font-medium mb-1">Your Name *</label>
                  <Input
                    id="name"
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                    className="bg-black/40 border-white/30 text-white"
                    placeholder="Enter your name"
                    required
                  />
                </div>
                
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <label htmlFor="email" className="block text-sm font-medium mb-1">Email Address</label>
                    <Input
                      id="email"
                      type="email"
                      value={email}
                      onChange={(e) => setEmail(e.target.value)}
                      className="bg-black/40 border-white/30 text-white"
                      placeholder="your@email.com"
                    />
                  </div>
                  <div>
                    <label htmlFor="phone" className="block text-sm font-medium mb-1">Phone Number</label>
                    <Input
                      id="phone"
                      type="tel"
                      value={phone}
                      onChange={(e) => setPhone(e.target.value)}
                      className="bg-black/40 border-white/30 text-white"
                      placeholder="Your phone number"
                    />
                  </div>
                </div>
                
                <div>
                  <label htmlFor="event-type" className="block text-sm font-medium mb-1">Event Type</label>
                  <select
                    id="event-type"
                    value={eventType}
                    onChange={(e) => setEventType(e.target.value)}
                    className="w-full px-3 py-2 bg-black/40 border border-white/30 rounded-md text-white focus:outline-none focus:ring-2 focus:ring-karaoke-pink"
                  >
                    <option value="">Select event type</option>
                    <option value="private">Private Party</option>
                    <option value="corporate">Corporate Event</option>
                    <option value="wedding">Wedding</option>
                    <option value="school">School Event</option>
                    <option value="other">Other</option>
                  </select>
                </div>
                
                <div>
                  <label htmlFor="message" className="block text-sm font-medium mb-1">Your Message *</label>
                  <Textarea
                    id="message"
                    value={message}
                    onChange={(e) => setMessage(e.target.value)}
                    className="bg-black/40 border-white/30 text-white min-h-[150px]"
                    placeholder="Tell us about your event or question"
                    required
                  />
                </div>
                
                <div>
                  <Button 
                    type="submit"
                    disabled={isSubmitting}
                    className="w-full bg-gradient-to-r from-karaoke-yellow to-karaoke-pink hover:opacity-90 text-white font-bold py-3"
                  >
                    {isSubmitting ? (
                      "Sending..."
                    ) : (
                      <>
                        <Send className="h-4 w-4 mr-2" />
                        Send Message
                      </>
                    )}
                  </Button>
                </div>
              </form>
            </div>
            
            <div>
              <div className="bg-black/40 rounded-xl shadow-lg p-6 mb-8">
                <h2 className="text-2xl font-bold mb-6">Contact Information</h2>
                
                <div className="space-y-6">
                  <div className="flex items-start">
                    <PhoneCall className="h-6 w-6 text-karaoke-yellow mr-4 mt-1" />
                    <div>
                      <h3 className="font-semibold">Phone Number</h3>
                      <p className="text-lg">776-9319</p>
                      <p className="text-sm text-white/70">Available for calls and WhatsApp</p>
                    </div>
                  </div>
                  
                  <div className="flex items-start">
                    <Mail className="h-6 w-6 text-karaoke-blue mr-4 mt-1" />
                    <div>
                      <h3 className="font-semibold">Email Address</h3>
                      <p className="text-lg">info@deankraokeguy.com</p>
                      <p className="text-sm text-white/70">For bookings and inquiries</p>
                    </div>
                  </div>
                  
                  <div className="flex items-start">
                    <MapPin className="h-6 w-6 text-karaoke-pink mr-4 mt-1" />
                    <div>
                      <h3 className="font-semibold">Location</h3>
                      <p className="text-lg">Caribbean-based</p>
                      <p className="text-sm text-white/70">Available for events throughout the region</p>
                    </div>
                  </div>
                </div>
              </div>
              
              <div className="bg-black/40 rounded-xl shadow-lg p-6">
                <h2 className="text-2xl font-bold mb-6">Book Your Event</h2>
                
                <div className="mb-6">
                  <p>
                    Ready to bring the ultimate karaoke experience to your event? Contact Dean De Karaoke Guy for:
                  </p>
                  <ul className="list-disc list-inside mt-3 space-y-1">
                    <li>Private parties and celebrations</li>
                    <li>Corporate team-building events</li>
                    <li>Wedding receptions and special occasions</li>
                    <li>School and community functions</li>
                    <li>Restaurant and bar entertainment</li>
                  </ul>
                </div>
                
                <div className="bg-karaoke-purple/30 p-4 rounded-lg">
                  <h3 className="font-semibold text-karaoke-yellow">Quick Response Guarantee</h3>
                  <p className="text-sm">
                    We aim to respond to all inquiries within 24 hours. For urgent bookings, please call directly.
                  </p>
                </div>
              </div>
            </div>
          </div>
          
          <div className="mt-8 bg-black/40 rounded-xl shadow-lg p-6">
            <h2 className="text-2xl font-bold text-center mb-4 gradient-text">Follow Dean De Karaoke Guy</h2>
            <p className="text-center mb-6">
              Stay updated on the latest events, performances, and the Sing It Own It Countdown!
            </p>
            <div className="flex justify-center space-x-6">
              <a href="#" className="group">
                <div className="p-3 bg-white/10 rounded-full group-hover:bg-karaoke-yellow/20 transition-colors">
                  <svg className="h-8 w-8 text-white group-hover:text-karaoke-yellow" fill="currentColor" viewBox="0 0 24 24" aria-hidden="true">
                    <path fillRule="evenodd" d="M12.315 2c2.43 0 2.784.013 3.808.06 1.064.049 1.791.218 2.427.465a4.902 4.902 0 011.772 1.153 4.902 4.902 0 011.153 1.772c.247.636.416 1.363.465 2.427.048 1.067.06 1.407.06 4.123v.08c0 2.643-.012 2.987-.06 4.043-.049 1.064-.218 1.791-.465 2.427a4.902 4.902 0 01-1.153 1.772 4.902 4.902 0 01-1.772 1.153c-.636.247-1.363.416-2.427.465-1.067.048-1.407.06-4.123.06h-.08c-2.643 0-2.987-.012-4.043-.06-1.064-.049-1.791-.218-2.427-.465a4.902 4.902 0 01-1.772-1.153 4.902 4.902 0 01-1.153-1.772c-.247-.636-.416-1.363-.465-2.427-.047-1.024-.06-1.379-.06-3.808v-.63c0-2.43.013-2.784.06-3.808.049-1.064.218-1.791.465-2.427a4.902 4.902 0 011.153-1.772A4.902 4.902 0 015.45 2.525c.636-.247 1.363-.416 2.427-.465C8.901 2.013 9.256 2 11.685 2h.63zm-.081 1.802h-.468c-2.456 0-2.784.011-3.807.058-.975.045-1.504.207-1.857.344-.467.182-.8.398-1.15.748-.35.35-.566.683-.748 1.15-.137.353-.3.882-.344 1.857-.047 1.023-.058 1.351-.058 3.807v.468c0 2.456.011 2.784.058 3.807.045.975.207 1.504.344 1.857.182.466.399.8.748 1.15.35.35.683.566 1.15.748.353.137.882.3 1.857.344 1.054.048 1.37.058 4.041.058h.08c2.597 0 2.917-.01 3.96-.058.976-.045 1.505-.207 1.858-.344.466-.182.8-.398 1.15-.748.35-.35.566-.683.748-1.15.137-.353.3-.882.344-1.857.048-1.055.058-1.37.058-4.041v-.08c0-2.597-.01-2.917-.058-3.96-.045-.976-.207-1.505-.344-1.858a3.097 3.097 0 00-.748-1.15 3.098 3.098 0 00-1.15-.748c-.353-.137-.882-.3-1.857-.344-1.023-.047-1.351-.058-3.807-.058zM12 6.865a5.135 5.135 0 110 10.27 5.135 5.135 0 010-10.27zm0 1.802a3.333 3.333 0 100 6.666 3.333 3.333 0 000-6.666zm5.338-3.205a1.2 1.2 0 110 2.4 1.2 1.2 0 010-2.4z" clipRule="evenodd" />
                  </svg>
                </div>
              </a>
              <a href="#" className="group">
                <div className="p-3 bg-white/10 rounded-full group-hover:bg-karaoke-blue/20 transition-colors">
                  <svg className="h-8 w-8 text-white group-hover:text-karaoke-blue" fill="currentColor" viewBox="0 0 24 24" aria-hidden="true">
                    <path d="M8.29 20.251c7.547 0 11.675-6.253 11.675-11.675 0-.178 0-.355-.012-.53A8.348 8.348 0 0022 5.92a8.19 8.19 0 01-2.357.646 4.118 4.118 0 001.804-2.27 8.224 8.224 0 01-2.605.996 4.107 4.107 0 00-6.993 3.743 11.65 11.65 0 01-8.457-4.287 4.106 4.106 0 001.27 5.477A4.072 4.072 0 012.8 9.713v.052a4.105 4.105 0 003.292 4.022 4.095 4.095 0 01-1.853.07 4.108 4.108 0 003.834 2.85A8.233 8.233 0 012 18.407a11.616 11.616 0 006.29 1.84" />
                  </svg>
                </div>
              </a>
              <a href="#" className="group">
                <div className="p-3 bg-white/10 rounded-full group-hover:bg-karaoke-pink/20 transition-colors">
                  <svg className="h-8 w-8 text-white group-hover:text-karaoke-pink" fill="currentColor" viewBox="0 0 24 24" aria-hidden="true">
                    <path fillRule="evenodd" d="M12 2C6.477 2 2 6.484 2 12.017c0 4.425 2.865 8.18 6.839 9.504.5.092.682-.217.682-.483 0-.237-.008-.868-.013-1.703-2.782.605-3.369-1.343-3.369-1.343-.454-1.158-1.11-1.466-1.11-1.466-.908-.62.069-.608.069-.608 1.003.07 1.531 1.032 1.531 1.032.892 1.53 2.341 1.088 2.91.832.092-.647.35-1.088.636-1.338-2.22-.253-4.555-1.113-4.555-4.951 0-1.093.39-1.988 1.029-2.688-.103-.253-.446-1.272.098-2.65 0 0 .84-.27 2.75 1.026A9.564 9.564 0 0112 6.844c.85.004 1.705.115 2.504.337 1.909-1.296 2.747-1.027 2.747-1.027.546 1.379.202 2.398.1 2.651.64.7 1.028 1.595 1.028 2.688 0 3.848-2.339 4.695-4.566 4.943.359.309.678.92.678 1.855 0 1.338-.012 2.419-.012 2.747 0 .268.18.58.688.482A10.019 10.019 0 0022 12.017C22 6.484 17.522 2 12 2z" clipRule="evenodd" />
                  </svg>
                </div>
              </a>
            </div>
          </div>
        </div>
      </div>
    </PageLayout>
  );
};

export default Contact;
