
export interface FileUploadProps {
  id: string;
  label: string;
  accept: string;
  maxSize: number;
  file: File | null;
  onChange: (file: File | null) => void;
  errorMessage?: string;
}

export interface UploadFormData {
  whatsappNumber: string;
  title: string;
  videoFile: File | null;
  photoFile: File | null;
}
