import { Cloudinary } from '@cloudinary/url-gen';
import { auto } from '@cloudinary/url-gen/actions/resize';
import { autoGravity } from '@cloudinary/url-gen/qualifiers/gravity';
import { AdvancedImage } from '@cloudinary/react';

const cld = new Cloudinary({
  cloud: {
    cloudName: 'dyfg9vlvg'
  }
});

const cloudinaryService = {
    uploadImage: async (file) => {
        try {
            if (!file) {
                throw new Error('No file selected for upload');
            }

            if (!file.type.startsWith('image/')) {
                throw new Error('Please select an image file');
            }

            if (file.size > 10 * 1024 * 1024) { // 10MB limit
                throw new Error('Image size exceeds 10MB limit');
            }

            const formData = new FormData();
            formData.append('file', file);
            formData.append('upload_preset', 'book_management');
            
            const response = await fetch(
                'https://api.cloudinary.com/v1_1/dyfg9vlvg/image/upload',
                {
                    method: 'POST',
                    body: formData
                }
            );

            if (!response.ok) {
                const errorData = await response.json();
                const errorMessage = errorData.error?.message || 'Unknown error occurred';
                throw new Error(`Cloudinary upload failed: ${errorMessage}`);
            }
            
            const data = await response.json();
            if (!data.secure_url) {
                throw new Error('Failed to get image URL from Cloudinary');
            }

            console.log('Image uploaded successfully:', {
                public_id: data.public_id,
                secure_url: data.secure_url
            });
            return data.secure_url;
        } catch (error) {
            console.error('Detailed error:', error);
            throw new Error(`Upload failed: ${error.message}`);
        }
    },

    getImageUrl: (publicId) => {
        const img = cld.image(publicId)
            .format('auto')
            .quality('auto')
            .resize(auto().gravity(autoGravity()).width(300).height(450));
        
        return img.toURL();
    },

    getAdvancedImage: (publicId) => {
        const img = cld.image(publicId)
            .format('auto')
            .quality('auto')
            .resize(auto().gravity(autoGravity()).width(300).height(450));
        
        return img;
    }
};

export default cloudinaryService;
