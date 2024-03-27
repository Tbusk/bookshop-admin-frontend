import * as Yup from 'yup';
// Interface for Book component
export interface Book {
    bookID: number,
    isbn10: string,
    isbn13: string,
    title: string,
    description: string,
    genre: string,
    author: string,
    publisher: string,
    image: string,
    language: string,
    pageCount: number,
    releaseDate: string,
    hardcoverPrice: number,
    paperbackPrice: number,
    ebookPrice: number,
    audiobookPrice: number,
    ratings: number,
    ratingsCount: number
}

// Interface for User component
export interface User {
    userID: number,
    username: string,
    firstName: string,
    lastName: string,
    emailAddress: string,
    phoneNumber: string,
    profilePicture: string,
    role: string,
    enabled: boolean,
    locked: boolean
}

// Interface for Column Selection Component
export interface ColumnMeta {
    field: string;
    header: string;
}

// Interface for Book form component
export interface BookFormTemplate {
    book: Book,
    handleChange: (e: React.ChangeEvent<HTMLInputElement>) => void,
    showImage: boolean,
    validationSchema?: Yup.ObjectSchema<any>
    isSubmitting?: boolean,
    handleSubmit?: () => void,
}