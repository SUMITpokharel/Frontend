import React, { createContext, useContext, useEffect, useState } from "react";

import bookmarkService from "../services/BookmarkService";

const BookmarkContext = createContext();

export const useBookmarks = () => useContext(BookmarkContext);

export const BookmarkProvider = ({ children }) => {
  const [bookmarkedBooks, setBookmarkedBooks] = useState([]);
  const [isLoading, setIsLoading] = useState(true);

  const fetchBookmarks = async () => {
    setIsLoading(true);
    try {
      const data = await bookmarkService.getBookmarks();
      setBookmarkedBooks(data);
    } catch (err) {
      setBookmarkedBooks([]);
    }
    setIsLoading(false);
  };

  useEffect(() => {
    fetchBookmarks();
  }, []);

  const addBookmark = async (bookId) => {
    await bookmarkService.addBookmark(bookId);
    fetchBookmarks();
  };

  const removeBookmark = async (bookId) => {
    await bookmarkService.removeBookmark(bookId);
    fetchBookmarks();
  };

  const isBookmarked = (bookId) =>
    bookmarkedBooks.some((b) => b.bookId === bookId);

  return (
    <BookmarkContext.Provider
      value={{
        bookmarkedBooks,
        isLoading,
        addBookmark,
        removeBookmark,
        isBookmarked,
        fetchBookmarks,
      }}
    >
      {children}
    </BookmarkContext.Provider>
  );
};
