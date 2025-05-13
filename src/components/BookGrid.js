import React from "react";
import { Link } from "react-router-dom";
import "./BookGrid.css";
import { AdvancedImage } from '@cloudinary/react';
import { Cloudinary } from '@cloudinary/url-gen';
import { auto } from '@cloudinary/url-gen/actions/resize';
import { autoGravity } from '@cloudinary/url-gen/qualifiers/gravity';

// Create Cloudinary instance
const cld = new Cloudinary({ cloud: { cloudName: 'dyfg9vlvg' } });

// Function to get optimized image
const getOptimizedImage = (publicId) => {
  return cld.image(publicId)
    .format('auto')
    .quality('auto')
    .resize(auto().gravity(autoGravity()).width(300).height(450));
};

const BookGrid = ({ books, loading, type, className }) => {
  if (loading) {
    return <div className="loading">Loading...</div>;
  }

  return (
    <div className={`book-grid ${className || ""}`}>
      {books.map((book) => (
        <Link
          to={`/user/book/${book.bookId}`}
          className="book-card"
          key={book.bookId}
        >
          <div className="book-cover">
            {book.discount?.onSale && (
              <span className="book-sale-tag">On Sale</span>
            )}
            {book.isDiscounted && (
              <span className="book-discount-tag">
                -{book.discount.percentage}%
              </span>
            )}
            {book.imageUrl ? (
              <AdvancedImage 
                cldImg={getOptimizedImage(book.imageUrl)} 
                alt={book.bookName}
                className="book-cover-image"
              />
            ) : (
              <div className="book-img-placeholder"></div>
            )}
          </div>
          <div className="book-info">
            <h3>{book.bookName}</h3>
            <p className="book-author">{book.publisherName || "Unknown"}</p>
            <div className="book-price">
              {book.isDiscounted ? (
                <>
                  <span className="price-discount">
                    ${book.discountedPrice.toFixed(2)}
                  </span>
                  <span className="price-original">
                    ${book.price.toFixed(2)}
                  </span>
                </>
              ) : (
                <span className="price-normal">${book.price.toFixed(2)}</span>
              )}
            </div>
          </div>
        </Link>
      ))}
    </div>
  );
};

export default BookGrid;
