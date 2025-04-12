
import React, { useState } from 'react';
import { Image } from 'lucide-react';
import PageLayout from '@/components/Layout/PageLayout';

// Mock data until connected to Supabase
const mockPhotos = [
  {
    id: '1',
    title: 'Karaoke Setup',
    image_url: '/lovable-uploads/2f07e900-4b2c-447a-a8bc-0e4b557bb1d4.png',
    uploader: 'Dean'
  },
  {
    id: '2',
    title: 'Wheel of Songs',
    image_url: '/lovable-uploads/8f07ad83-98c0-439b-bbd2-08b32ce62aaf.png',
    uploader: 'Dean'
  },
  {
    id: '3',
    title: 'Dance Floor',
    image_url: '/lovable-uploads/8223791e-e9dc-4b8d-84fc-98d8f6f1aec9.png',
    uploader: 'Dean'
  },
  {
    id: '4',
    title: 'Microphone',
    image_url: '/lovable-uploads/5dc46ec4-c366-4786-b56d-cece190bc1a6.png',
    uploader: 'Dean'
  },
  {
    id: '5',
    title: 'Karaoke Game Show',
    image_url: '/lovable-uploads/9855b929-6311-4870-82a6-5aeccc3bf1f7.png',
    uploader: 'Dean'
  },
  {
    id: '6',
    title: 'Dance Songs',
    image_url: '/lovable-uploads/624dcf17-1dd5-4d12-a2b7-3f1661f35717.png',
    uploader: 'Dean'
  },
  {
    id: '7',
    title: 'Caribbean Carnival',
    image_url: '/lovable-uploads/033bb0dd-e701-4967-9e0e-3885ecc9e80a.png',
    uploader: 'Dean'
  }
];

const Gallery = () => {
  const [selectedImage, setSelectedImage] = useState<string | null>(null);
  const [selectedImageDetails, setSelectedImageDetails] = useState<{ title: string, uploader: string } | null>(null);
  
  const openLightbox = (imageUrl: string, title: string, uploader: string) => {
    setSelectedImage(imageUrl);
    setSelectedImageDetails({ title, uploader });
    document.body.style.overflow = 'hidden';
  };
  
  const closeLightbox = () => {
    setSelectedImage(null);
    setSelectedImageDetails(null);
    document.body.style.overflow = 'auto';
  };

  return (
    <PageLayout>
      <div className="min-h-screen bg-gradient-to-b from-black via-karaoke-purple to-karaoke-blue text-white p-4">
        <div className="max-w-7xl mx-auto">
          <div className="text-center mb-8">
            <h1 className="text-4xl font-extrabold gradient-text mb-2">Event Gallery</h1>
            <p className="text-xl">Moments from Dean De Karaoke Guy events</p>
          </div>
          
          <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-4">
            {mockPhotos.map((photo) => (
              <div 
                key={photo.id}
                onClick={() => openLightbox(photo.image_url, photo.title, photo.uploader)}
                className="cursor-pointer overflow-hidden rounded-xl aspect-square shadow-lg transform transition-all hover:-translate-y-1 hover:shadow-xl"
              >
                <div className="relative h-full group">
                  <img 
                    src={photo.image_url} 
                    alt={photo.title}
                    className="object-cover w-full h-full transition-transform group-hover:scale-105"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity flex flex-col justify-end p-3">
                    <h3 className="text-white font-semibold text-sm">{photo.title}</h3>
                    <p className="text-white/80 text-xs">{photo.uploader}</p>
                  </div>
                </div>
              </div>
            ))}
          </div>
          
          {mockPhotos.length === 0 && (
            <div className="flex flex-col items-center justify-center py-12">
              <Image className="h-16 w-16 text-white/50 mb-4" />
              <p className="text-xl">No photos uploaded yet.</p>
            </div>
          )}
          
          {/* Lightbox */}
          {selectedImage && (
            <div 
              className="fixed inset-0 bg-black/90 flex items-center justify-center z-50 p-4"
              onClick={closeLightbox}
            >
              <div 
                className="max-w-4xl w-full"
                onClick={(e) => e.stopPropagation()}
              >
                <img 
                  src={selectedImage} 
                  alt={selectedImageDetails?.title || "Gallery image"} 
                  className="w-full object-contain max-h-[80vh]"
                />
                {selectedImageDetails && (
                  <div className="text-center mt-4">
                    <h3 className="text-white text-xl font-bold">{selectedImageDetails.title}</h3>
                    <p className="text-white/80">Uploaded by: {selectedImageDetails.uploader}</p>
                  </div>
                )}
                <button 
                  onClick={closeLightbox}
                  className="absolute top-4 right-4 text-white text-xl font-bold bg-black/50 w-10 h-10 rounded-full flex items-center justify-center hover:bg-black/80"
                >
                  ×
                </button>
              </div>
            </div>
          )}
        </div>
      </div>
    </PageLayout>
  );
};

export default Gallery;
