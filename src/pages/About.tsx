
import React from 'react';
import { Mic2, Music, Award, Headphones } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Link } from 'react-router-dom';
import PageLayout from '@/components/Layout/PageLayout';

const About = () => {
  return (
    <PageLayout>
      <div className="min-h-screen bg-gradient-to-b from-karaoke-purple via-black to-karaoke-blue text-white p-4">
        <div className="max-w-5xl mx-auto">
          <div className="text-center mb-8">
            <h1 className="text-4xl font-extrabold gradient-text mb-2">About Dean De Karaoke Guy</h1>
            <p className="text-xl">Bringing Caribbean vibes and karaoke magic to every event</p>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            <div className="bg-black/40 rounded-xl shadow-lg p-6">
              <h2 className="text-2xl font-bold mb-4 gradient-text">The Man Behind The Mic</h2>
              <p className="mb-4">
                Dean is a passionate karaoke DJ bringing vibes, fun, and performance magic to every event. Based in the Caribbean with a global vision, 
                he transforms ordinary gatherings into extraordinary experiences with his signature blend of entertainment and engagement.
              </p>
              <p className="mb-4">
                With years of experience hosting events across the region, Dean has developed a unique approach to karaoke that goes beyond 
                simply playing tracks and passing the microphone. Each event is carefully crafted to create a supportive, exciting atmosphere 
                where everyone feels comfortable to "Sing It Own It."
              </p>
              <p>
                Whether you're looking for corporate entertainment, a private party DJ, or want to book a full karaoke experience for your venue, 
                Dean De Karaoke Guy delivers unforgettable moments every time.
              </p>
              
              <div className="mt-6">
                <h3 className="text-xl font-semibold mb-2">Services Offered:</h3>
                <ul className="list-disc list-inside space-y-2 text-white/90">
                  <li>Full karaoke setup with professional equipment</li>
                  <li>Extensive song library with Caribbean and international hits</li>
                  <li>Interactive games and entertainment</li>
                  <li>Corporate events and team building</li>
                  <li>Private parties and celebrations</li>
                  <li>School and community events</li>
                </ul>
              </div>
              
              <div className="mt-6 flex justify-center">
                <Button asChild className="bg-karaoke-yellow hover:bg-karaoke-yellow/80 text-black">
                  <Link to="/contact">
                    <Headphones className="h-5 w-5 mr-2" />
                    Book An Event
                  </Link>
                </Button>
              </div>
            </div>
            
            <div>
              <div className="bg-black/40 rounded-xl shadow-lg p-6 mb-8">
                <h2 className="text-2xl font-bold mb-4 gradient-text">The "Sing It Own It" Movement</h2>
                <p className="mb-4">
                  The "Sing It Own It" movement celebrates individuality, entertainment, and embracing every voice. Whether you buss or bless the mic 
                  — it's your stage! This philosophy is at the heart of everything Dean does, creating a supportive community where everyone can express 
                  themselves through music.
                </p>
                <p>
                  Our weekly countdown showcases the best performances from events, giving everyone a chance to shine and earn recognition for their unique talent.
                  The mantra "No Shame If Yuh Buss" reminds us all that karaoke is about fun and self-expression, not perfection.
                </p>
                
                <div className="flex justify-center mt-6">
                  <div className="bg-black/30 p-4 rounded-lg inline-block">
                    <h3 className="text-karaoke-yellow text-lg font-bold">Our Motto:</h3>
                    <p className="text-xl italic">"No Shame If Yuh Buss"</p>
                  </div>
                </div>
              </div>
              
              <div className="bg-black/40 rounded-xl shadow-lg p-6">
                <h2 className="text-2xl font-bold mb-4 gradient-text">Equipment & Technology</h2>
                <p className="mb-4">
                  Dean De Karaoke Guy uses only the highest quality sound equipment, lighting, and display systems to create the ultimate karaoke experience.
                  Our digital song library is regularly updated with the latest hits and classics across all genres.
                </p>
                
                <div className="flex flex-wrap justify-center gap-4 mt-6">
                  <div className="bg-black/30 p-3 rounded-lg flex items-center">
                    <Music className="h-5 w-5 text-karaoke-pink mr-2" />
                    <span>Professional Sound</span>
                  </div>
                  <div className="bg-black/30 p-3 rounded-lg flex items-center">
                    <Mic2 className="h-5 w-5 text-karaoke-blue mr-2" />
                    <span>HD Karaoke Systems</span>
                  </div>
                  <div className="bg-black/30 p-3 rounded-lg flex items-center">
                    <Award className="h-5 w-5 text-karaoke-yellow mr-2" />
                    <span>Custom Experience</span>
                  </div>
                </div>
              </div>
            </div>
          </div>
          
          <div className="mt-8 bg-black/40 rounded-xl shadow-lg p-6">
            <h2 className="text-2xl font-bold text-center mb-6 gradient-text">Featured Gallery</h2>
            <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-4">
              <img src="/lovable-uploads/2f07e900-4b2c-447a-a8bc-0e4b557bb1d4.png" alt="Karaoke Event" className="w-full h-32 object-cover rounded-lg" />
              <img src="/lovable-uploads/8f07ad83-98c0-439b-bbd2-08b32ce62aaf.png" alt="Wheel of Songs" className="w-full h-32 object-cover rounded-lg" />
              <img src="/lovable-uploads/8223791e-e9dc-4b8d-84fc-98d8f6f1aec9.png" alt="Dance Floor" className="w-full h-32 object-cover rounded-lg" />
              <img src="/lovable-uploads/9855b929-6311-4870-82a6-5aeccc3bf1f7.png" alt="Karaoke Game" className="w-full h-32 object-cover rounded-lg" />
            </div>
            <div className="text-center mt-6">
              <Button asChild className="bg-karaoke-blue hover:bg-karaoke-blue/80">
                <Link to="/gallery">View Full Gallery</Link>
              </Button>
            </div>
          </div>
        </div>
      </div>
    </PageLayout>
  );
};

export default About;
