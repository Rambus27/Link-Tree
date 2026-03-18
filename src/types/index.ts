export interface LinkItem {
  id: string;
  title: string;
  url: string;
  icon?: string;
  color?: string;
  backgroundColor?: string;
}

export interface PageConfig {
  username?: string;
  title: string;
  bio: string;
  profileImage?: string;
  background: {
    type: 'color' | 'gradient' | 'image';
    value: string;
    gradient?: {
      from: string;
      to: string;
      direction: string;
    };
  };
  links: LinkItem[];
  font: string;
  primaryColor: string;
  textColor: string;
  buttonStyle: 'rounded' | 'pill' | 'square' | 'outline';
  music?: {
    url: string;
    title?: string;
    autoplay: boolean;
  };
  theme: 'light' | 'dark';
}

export interface Page {
  _id?: string;
  publicId: string;
  username?: string;
  config: PageConfig;
  viewCount: number;
  createdAt: Date;
  updatedAt: Date;
}
