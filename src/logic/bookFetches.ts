import {Book} from "./interfaces";

// Get all books from the database
export async function getBooks():Promise<Book[]> {
    try {
        const response = await fetch(`http://localhost:8080/api/books/list`, {
                method: 'GET',
                headers: {
                    'Content-Type': 'application/json',
                }
            }
        );
        if (!response.ok) {
            throw new Error('Failed to fetch books')
        }

        return await response.json();
    } catch (error) {
        console.error(error);
        throw error;
    }
}

// Get a single book from the database
export async function getBook(bookID: number): Promise<Book> {
    try {
        const response = await fetch(`http://localhost:8080/api/books/${bookID}`, {
                method: 'GET',
                headers: {
                    'Content-Type': 'application/json',
                }
            }
        );
        if (!response.ok) {
            throw new Error('Failed to fetch book')
        }

        return await response.json();
    } catch (error) {
        console.error(error);
        throw error;
    }
}

// add a book to the database
export async function addBook(book: Book): Promise<Book> {
    try {
        const response = await fetch(`http://localhost:8080/api/books`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify(book)
            }
        );
        if (!response.ok) {
            throw new Error('Failed to add book')
        }

        return await response.json();
    } catch (error) {
        console.error(error);
        throw error;
    }
}

// update a book in the database
export async function updateBook(bookID: number, book: Book): Promise<Book> {
    try {
        const response = await fetch(`http://localhost:8080/api/books/${bookID}`, {
                method: 'PUT',
                headers: {
                    'Content-Type': 'application/json',
                },
            body: JSON.stringify(book)
            }
        );
        if (!response.ok) {
            throw new Error('Failed to update book')
        }

        return await response.json();
    } catch (error) {
        console.error(error);
        throw error;
    }
}

// delete a book from the database
export async function deleteBook(bookID: number): Promise<Book> {
    try {
        const response = await fetch(`http://localhost:8080/api/books/${bookID}`, {
                method: 'DELETE',
                headers: {
                    'Content-Type': 'application/json',
                }
            }
        );
        if (!response.ok) {
            throw new Error('Failed to delete book')
        }

        return await response.json();
    } catch (error) {
        console.error(error);
        throw error;
    }
}