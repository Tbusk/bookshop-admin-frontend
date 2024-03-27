import {ColumnMeta} from "./interfaces";

// Columns available for the books table
export const bookColumns: ColumnMeta[] = [
    { field: 'bookID', header: 'ID' },
    { field: 'isbn10', header: 'ISBN-10' },
    { field: 'isbn13', header: 'ISBN-13' },
    { field: 'title', header: 'Title' },
    { field: 'description', header: 'Description' },
    { field: 'genre', header: 'Genre' },
    { field: 'author', header: 'Author' },
    { field: 'publisher', header: 'Publisher' },
    { field: 'image', header: 'Image' },
    { field: 'language', header: 'Language' },
    { field: 'pageCount', header: 'Page Count' },
    { field: 'releaseDate', header: 'Released Date' },
    { field: 'hardcoverPrice', header: 'Hardcover Price' },
    { field: 'paperbackPrice', header: 'Paperback Price' },
    { field: 'ebookPrice', header: 'eBook Price' },
    { field: 'audiobookPrice', header: 'Audiobook Price' },
    { field: 'ratings', header: 'Ratings' },
    { field: 'ratingsCount', header: 'Ratings Count' }
];

// Columns visible by default for the books table
export const defaultVisibleBookColumns: ColumnMeta[] = [
    { field: 'bookID', header: 'ID' },
    { field: 'title', header: 'Title' },
    { field: 'genre', header: 'Genre' },
    { field: 'author', header: 'Author' },
    { field: 'publisher', header: 'Publisher' },
    { field: 'releaseDate', header: 'Released Date' },
    { field: 'hardcoverPrice', header: 'Hardcover Price' },
    { field: 'paperbackPrice', header: 'Paperback Price' },
    { field: 'ebookPrice', header: 'eBook Price' },
    { field: 'audiobookPrice', header: 'Audiobook Price' },
];

// Columns available for the users table
export const userColumns: ColumnMeta[] = [
    { field: 'userID', header:'ID'},
    { field: 'username', header:'Username'},
    { field: 'emailAddress', header: 'Email'},
    { field: 'firstName', header: 'First Name'},
    { field: 'lastName', header: 'Last Name'},
    { field: 'phoneNumber', header: 'Phone Number'},
    { field: 'role', header: 'Role'},
    { field: 'enabled', header: 'Enabled'},
    { field: 'locked', header: 'Locked'},
    { field: 'profilePicture', header: 'Profile Picture'}
];

// Columns visible by default for the users table
export const defaultVisibleUserColumns: ColumnMeta[] = [
    { field: 'userID', header:'ID'},
    { field: 'username', header:'Username'},
    { field: 'emailAddress', header: 'Email'},
    { field: 'firstName', header: 'First Name'},
    { field: 'lastName', header: 'Last Name'},
    { field: 'phoneNumber', header: 'Phone Number'},
    { field: 'role', header: 'Role'},
];
