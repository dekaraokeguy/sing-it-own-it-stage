
import React from 'react';
import { UploadForm } from '@/components/upload/UploadForm';
import PageLayout from '@/components/Layout/PageLayout';

const UploadPage = () => {
  return (
    <PageLayout>
      <div className="min-h-screen bg-gradient-to-b from-karaoke-pink via-karaoke-purple to-black text-white p-4">
        <div className="max-w-3xl mx-auto">
          <div className="text-center mb-8">
            <h1 className="text-4xl font-extrabold gradient-text mb-2">Upload Your Performance</h1>
            <p className="text-xl">Share your karaoke moments with the world!</p>
          </div>
          
          <div className="bg-black/40 rounded-xl shadow-lg p-6">
            <UploadForm />
            
            <div className="mt-6 text-center">
              <p className="text-white/80 text-sm">
                By uploading, you agree to share your performance on the Sing It Own It platform.
                <br/>Your content will be reviewed before appearing in the countdown.
              </p>
            </div>
          </div>
          
          <div className="mt-8 bg-black/40 rounded-xl shadow-lg p-6">
            <h2 className="text-xl font-bold mb-4">How It Works</h2>
            <ol className="list-decimal list-inside space-y-3 text-white/90">
              <li>Enter your WhatsApp number to log in</li>
              <li>Upload your performance video (max 50MB)</li>
              <li>Add an optional thumbnail image</li>
              <li>Wait for approval (usually within 24 hours)</li>
              <li>Share with friends and collect votes!</li>
            </ol>
            <p className="mt-4 text-karaoke-yellow">Top voted performances will be featured in our weekly "Sing It Own It Countdown"!</p>
          </div>
        </div>
      </div>
    </PageLayout>
  );
};

export default UploadPage;
