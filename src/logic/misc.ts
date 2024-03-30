
// Check if a date is valid
import {Book} from "./interfaces";

export function isValidDate(date: any) {
    return date instanceof Date && !isNaN(date.getTime());
}

// Currency formatter
export const currencyFormatter = new Intl.NumberFormat('en-US', {
    style: 'currency',
    currency: 'USD',
});

// Empty book object
export const emptyBook:Book = {
    bookID:0,
    isbn10: '',
    isbn13: '',
    title: '',
    description: '',
    genre: '',
    author:'',
    publisher: '',
    image: '',
    language: 'English',
    pageCount: 0,
    releaseDate: new Date().toISOString(),
    hardcoverPrice: 0,
    paperbackPrice: 0,
    ebookPrice: 0,
    audiobookPrice: 0,
    ratings: 0,
    ratingsCount: 0
}