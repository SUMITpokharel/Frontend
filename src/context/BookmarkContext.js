import React, { createContext, useContext, useEffect, useState } from "react";

import bookmarkService from "../services/BookmarkService";

const BookmarkContext = createContext();

export const useBookmarks = () => useContext(BookmarkContext);

export const BookmarkProvider = ({ children }) => {
  const [bookmarkedBooks, setBookmarkedBooks] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(null);

  const fetchBookmarks = async () => {
    setIsLoading(true);
    setError(null);
    try {
      const data = await bookmarkService.getBookmarks();
      const normalized = data.map((bm) => ({
        ...bm,
        bookId: bm.bookId || bm.BookId,
        bookMarkId: bm.bookMarkId || bm.BookMarkId,
        memberId: bm.memberId || bm.MemberId,
      }));
      setBookmarkedBooks(normalized);
    } catch (err) {
      console.error("Error fetching bookmarks:", err);
      setError(err.message || "Failed to fetch bookmarks");
      setBookmarkedBooks([]);
    }
    setIsLoading(false);
  };

  useEffect(() => {
    fetchBookmarks();
  }, []);

  const addBookmark = async (bookId) => {
    setError(null);
    try {
      await bookmarkService.addBookmark(bookId);
      await fetchBookmarks();
    } catch (err) {
      console.error("Error adding bookmark:", err);
      setError(err.message || "Failed to add bookmark");
    }
  };

  const removeBookmark = async (bookId) => {
    setError(null);
    try {
      await bookmarkService.removeBookmark(bookId);
      await fetchBookmarks();
    } catch (err) {
      console.error("Error removing bookmark:", err);
      setError(err.message || "Failed to remove bookmark");
    }
  };

  const isBookmarked = (bookId) =>
    bookmarkedBooks.some((b) => b.bookId === bookId);

  return (
    <BookmarkContext.Provider
      value={{
        bookmarkedBooks,
        isLoading,
        error,
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
