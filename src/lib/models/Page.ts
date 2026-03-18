import mongoose, { Schema, Document } from 'mongoose';
import { PageConfig } from '@/types';

export interface IPage extends Document {
  publicId: string;
  username?: string;
  config: PageConfig;
  viewCount: number;
  createdAt: Date;
  updatedAt: Date;
}

const LinkItemSchema = new Schema({
  id: String,
  title: String,
  url: String,
  icon: String,
  color: String,
  backgroundColor: String,
});

const PageSchema = new Schema<IPage>(
  {
    publicId: { type: String, required: true, unique: true, index: true },
    username: { type: String, sparse: true, index: true },
    config: {
      username: String,
      title: { type: String, required: true },
      bio: String,
      profileImage: String,
      background: {
        type: { type: String, enum: ['color', 'gradient', 'image'], default: 'color' },
        value: { type: String, default: '#ffffff' },
        gradient: {
          from: String,
          to: String,
          direction: String,
        },
      },
      links: [LinkItemSchema],
      font: { type: String, default: 'Inter' },
      primaryColor: { type: String, default: '#6366f1' },
      textColor: { type: String, default: '#1f2937' },
      buttonStyle: { type: String, enum: ['rounded', 'pill', 'square', 'outline'], default: 'pill' },
      music: {
        url: String,
        title: String,
        autoplay: Boolean,
      },
      theme: { type: String, enum: ['light', 'dark'], default: 'light' },
    },
    viewCount: { type: Number, default: 0 },
  },
  { timestamps: true }
);

const PageModel = mongoose.models.Page || mongoose.model<IPage>('Page', PageSchema);
export default PageModel;
