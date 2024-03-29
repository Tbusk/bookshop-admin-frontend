import React, {useEffect, useRef, useState} from 'react';
import './App.css';
import {AppLayout} from "@hilla/react-components/AppLayout";
import {DrawerToggle} from "@hilla/react-components/DrawerToggle";
import {Tabs, type TabsSelectedChangedEvent} from "@hilla/react-components/Tabs";
import { Tab } from '@hilla/react-components/Tab';
import img from "./images/bookshop.svg";
import personFillGear from 'bootstrap-icons/icons/person-fill-gear.svg';
import bookIcon from 'bootstrap-icons/icons/book.svg';
import { Icon } from '@hilla/react-components/Icon';
import {DataTable} from "primereact/datatable";
import {Book, BookFormTemplate, User} from "./logic/interfaces";
import {getBooks, getBook, deleteBook, updateBook, addBook} from "./logic/bookFetches";
import {getUsers} from "./logic/userFetches";
import { Column } from 'primereact/column';
import {MultiSelect, MultiSelectChangeEvent} from "primereact/multiselect";
import { Toolbar } from 'primereact/toolbar';
import {bookColumns, defaultVisibleBookColumns, defaultVisibleUserColumns} from "./logic/columns";
import {Dialog} from "primereact/dialog";
import {PencilIcon} from "primereact/icons/pencil";
import {TrashIcon} from "primereact/icons/trash";
import {TimesIcon} from "primereact/icons/times";
import {CheckIcon} from "primereact/icons/check";
import {PlusIcon} from "primereact/icons/plus";
import {InputText} from "primereact/inputtext";
import {SearchIcon} from "primereact/icons/search";
import {Toast} from 'primereact/toast';
import {currencyFormatter, emptyBook} from "./logic/misc";
import {Calendar} from "primereact/calendar";
import {FormikProps, useFormik} from 'formik';
import * as Yup from 'yup';

function App() {

    const [pageSelected, setPageSelected] = useState(0);
    const [books, setBooks] = useState<Book[]>([]);
    const [book, setBook] = useState<Book>();
    const [users, setUsers] = useState<User[]>([])
    const [bookEditDialog, setBookEditDialog] = useState(false);
    const [bookDeleteDialog, setBookDeleteDialog] = useState(false);
    const [bookAddDialog, setBookAddDialog] = useState(false);
    const [visibleBookColumns, setVisibleBookColumns] = useState(defaultVisibleBookColumns);
    const [visibleUserColumns, setVisibleUserColumns] = useState(defaultVisibleUserColumns);
    const [globalFilter, setGlobalFilter] = useState<string>('');
    const toast = useRef<Toast>(null);
    const [bookToAdd, setBookToAdd] = useState<Book>(emptyBook);
    const [submitting, setSubmitting] = useState(true);
    const formRef = useRef<FormikProps<Book>>(null);

    const validationSchema = Yup.object().shape({
        title: Yup.string().required('Title is required'),
        author: Yup.string().required('Author is required'),
        publisher: Yup.string().required('Publisher is required'),
        genre: Yup.string().required('Genre is required'),
        pageCount: Yup.number().required('Page Count is required').positive('Page Count must be positive').integer('Page Count must be an integer').min(1, 'Page Count must be at least 1')
    });

    // form validation for adding a book
    const formikAdd = useFormik({
        initialValues: emptyBook,
        validationSchema: validationSchema,
        onSubmit: (values) => {
            addCreatedBook(values);
            setBookAddDialog(false);
            setSubmitting(false);
        },
    })

    // form validation for editing a book
    const formikEdit = useFormik({
        initialValues: book || emptyBook,
        validationSchema: validationSchema,
        onSubmit: (values) => {
            updateSelectedBook(values.bookID, values);
            setBookEditDialog(false);
            setSubmitting(false);
        },
        enableReinitialize: true
    })

    // Fetch books and users
    useEffect(() => {
        try {
            Promise.all([getBooks(), getUsers()]).then(([books, users]) => {
                setBooks(books);
                setUsers(users);
            }).catch(error => {
                console.error(error);
            });
        } catch (error:any) {
            console.error(error);
            if(toast.current) {
                toast.current.show({severity:'error', summary: 'Error Message', detail: error.message, life: 3000});
            }
        }
    }, []);

    // Column toggle for book columns
    const onBookColumnToggle = (e: MultiSelectChangeEvent) => {
        let selectedColumns = e.value;
        let orderedSelectedColumns = bookColumns.filter((col) => selectedColumns.some((sCol: { field: string; }) => sCol.field === col.field));

        setVisibleBookColumns(orderedSelectedColumns);
    }

    // fetch single book by id, set book state, and open edit dialog
    const editBook = (bookID: number) => {
        getBook(bookID).then((data) => {
            setBook(data);
        });
        setBookEditDialog(true);
    };

    // fetch single book by id, set book state, and open delete dialog
    const confirmDeleteBook = (bookID: number) => {
        getBook(bookID).then((data) => {
            setBook(data);
        });
        setBookDeleteDialog(true);
    };

    // Add a book to the database
    async function addCreatedBook(book: Book) {
        try {
            await addBook(book);
            const updatedBooks = await getBooks();
            setBooks(updatedBooks);
            formikAdd.resetForm();
        } catch (error:any) {
            console.error(error);
            if(toast.current) {
                toast.current.show({severity:'error', summary: 'Error Message', detail: error.message, life: 3000});
            }
        }
    }

    // Delete a book from the database
    async function deleteSelectedBook(bookID: number) {
        try {
            await deleteBook(bookID);
            const updatedBooks = await getBooks();
            setBooks(updatedBooks);
        } catch (error:any) {
            console.error(error);
            if(toast.current) {
                toast.current.show({severity:'error', summary: 'Error Message', detail: error.message, life: 3000});
            }
        }
    }

    // Update a book in the database
    async function updateSelectedBook(bookID: number, book: Book) {
        try {
            await updateBook(bookID, book);
            const updatedBooks = await getBooks();
            setBooks(updatedBooks);
        } catch (error:any) {
            console.error(error);
            if(toast.current) {
                toast.current.show({severity:'error', summary: 'Error Message', detail: error.message, life: 3000});
            }
        }
    }

    // Template for datatable that represents the edit and delete buttons
    const editAndDeleteButtonTemplate = (book: Book) => {
        return (
            <div className="d-flex">
                <button className="btn btn-outline-primary d-flex align-items-center" onClick={() => editBook(book.bookID)} style={{borderRadius:'50%', padding:'0.8rem', marginRight: '.4rem'}}><PencilIcon/></button>
                <button className="btn btn-outline-warning d-flex align-items-center" onClick={() => confirmDeleteBook(book.bookID)} style={{borderRadius:'50%', padding:'0.8rem'}}><TrashIcon/></button>
            </div>
        );
    };

    // Delete book dialog footer with yes and no buttons
    const deleteBookDialogFooter = (bookID: number) => (
        <div className="d-flex justify-content-end">
            <div className="m-1">
                <button onClick={() => {setBookDeleteDialog(false);}} className="btn btn-outline-primary d-flex align-items-center"
                        style={{paddingLeft: '2rem', paddingRight: '2rem'}}><TimesIcon style={{marginRight: '.5rem'}}/>No
                </button>
            </div>
            <div className="m-1">
                <button onClick={() => {
                    deleteSelectedBook(bookID);
                    setBookDeleteDialog(false);
                }} className="btn btn-danger d-flex align-items-center"
                        style={{paddingLeft: '2rem', paddingRight: '2rem'}}><CheckIcon style={{marginRight: '.5rem'}}/>Yes
                </button>
            </div>
        </div>
    );

    // Edit book dialog footer with save and cancel buttons
    const editBookDialogFooter = (bookID: number) => (
        <div className="d-flex justify-content-end">
            {book &&(
                <>
                    <div className="m-1">
                        <button onClick={() => setBookEditDialog(false)} className="btn btn-outline-primary d-flex align-items-center"
                                style={{paddingLeft: '2rem', paddingRight: '2rem'}}><TimesIcon style={{marginRight: '.5rem'}}/>Cancel
                        </button>
                    </div>
                    <div className="m-1">
                        <button onClick={() => {
                            formikEdit.handleSubmit();
                        }} className="btn btn-success d-flex align-items-center" style={{paddingLeft: '2rem', paddingRight: '2rem'}}><CheckIcon style={{marginRight: '.5rem'}}/>Save
                        </button>
                    </div>
                </>
            )}

        </div>
    );

    // Add book dialog footer with add and cancel buttons
    const addBookDialogFooter = () => (
        <div className="d-flex justify-content-end">

            <div className="m-1">
                <button onClick={() =>  {
                    formikAdd.resetForm();
                    formikAdd.setErrors({});
                    setBookAddDialog(false);
                }} className="btn btn-outline-primary d-flex align-items-center"
                        style={{paddingLeft: '2rem', paddingRight: '2rem'}}><TimesIcon style={{marginRight: '.5rem'}}/>Cancel
                </button>
            </div>
            <div className="m-1">
                <button onClick={() => {
                    formikAdd.handleSubmit();
                }} className="btn btn-success d-flex align-items-center" style={{paddingLeft: '2rem', paddingRight: '2rem'}}><CheckIcon style={{marginRight: '.5rem'}}/>Add
                </button>
            </div>
        </div>
    );

    // Price formatter for book prices
    const priceBodyTemplate = (book: Book, field: string) => {
        switch(field) {
            case 'hardcoverPrice':
                return (
                    <span>
                        {currencyFormatter.format(book.hardcoverPrice)}
                    </span>
                );
            case 'paperbackPrice':
                return (
                    <span>
                        {currencyFormatter.format(book.paperbackPrice)}
                    </span>
                );
            case 'ebookPrice':
                return (
                    <span>
                        {currencyFormatter.format(book.ebookPrice)}
                    </span>
                );
            case 'audiobookPrice':
                return (
                    <span>
                        {currencyFormatter.format(book.audiobookPrice)}
                    </span>
                );
            default: return (<></>)
        }
    }

    // Template for toolbar with column toggle, search, and add book button
    const bookToolbarTemplate = () => {
        return (
            <div className="flex-wrap d-flex align-items-center justify-content-between">
                <MultiSelect value={visibleBookColumns} optionLabel="header" options={bookColumns} onChange={onBookColumnToggle} display="chip" style={{width:'26rem', marginRight:'10px'}}/>
                <span className="p-input-icon-left" style={{paddingRight: '10px'}}>
                <SearchIcon/>
                <InputText type="search" placeholder="Search..." onInput={(e) => {
                    const target = e.target as HTMLInputElement;
                    setGlobalFilter(target.value);
                }}/>
            </span>
                <button className="btn btn-primary" style={{fontSize: '18px'}} onClick={() => {
                    setBookAddDialog(true);
                }}><PlusIcon
                    style={{marginRight: '1rem'}}/> Add
                    a Book
                </button>
            </div>);
    };

    return (
        <AppLayout primarySection="drawer">
            <DrawerToggle slot="navbar"/>

            {/** Logo **/}
            <div slot="drawer" className="d-flex align-items-center" style={{paddingLeft:'1rem', paddingTop:'.5rem'}}>
                <img src={img} alt="bookshop" style={{height: '32px', width: 'auto', marginRight: 14}}/>
                <h1 className="metrophobic-regular m-0 h2">Bookshop</h1>
            </div>

            {/** Selected Tab Title **/}
            <h3 slot="navbar" className="lato-regular">{pageSelected === 0 ? 'User Management' : 'Book Management'}</h3>

            <Tabs slot="drawer" orientation="vertical" className="p-3" selected={pageSelected}
                  onSelectedChanged={(e: TabsSelectedChangedEvent) => setPageSelected(e.detail.value)}>

                <h5 className="m-0 pb-2 mb-2 lato-regular">MANAGEMENT</h5>

                {/** Users Tab **/}
                <Tab className="p-2 mb-2" id="users">
                    <a tabIndex={-1}>
                        <div className="d-flex align-items-center m-0">
                            <Icon src={personFillGear} style={{marginRight: '12px'}}></Icon>
                            <span className="m-0 lato-regular" style={{fontSize: 20}}>Users (View)</span>
                        </div>
                    </a>
                </Tab>

                {/** Books Tab**/}
                <Tab className="p-2" id="books">
                    <a tabIndex={-1}>
                        <div className="d-flex align-items-center m-0">
                            <Icon src={bookIcon} style={{marginRight: '12px'}}></Icon>
                            <span className="m-0 lato-regular" style={{fontSize: 20}}>Books</span>
                        </div>
                    </a>
                </Tab>
            </Tabs>
            <div className="container-fluid p-4">
                {/** Error Message Popups **/}
                <Toast ref={toast} />

                {/** Users Table **/}
                {users && pageSelected === 0 && (
                    <>
                        <DataTable value={users} size={"large"} stripedRows paginator rows={10}>
                            {visibleUserColumns.map((column) => {


                                return (
                                    <Column key={column.field} field={column.field} header={column.header} sortable/>
                                );
                            })}

                        </DataTable>
                    </>
                )}

                {/** Books Table **/}
                {books && pageSelected === 1 && (
                    <>
                        <Toolbar className="mb-4 toolbar-container" end={bookToolbarTemplate}></Toolbar>
                        <DataTable value={books} size={"large"} stripedRows paginator rows={10}
                                   globalFilter={globalFilter}
                                   emptyMessage="No books found."
                                   paginatorTemplate="FirstPageLink PrevPageLink PageLinks NextPageLink LastPageLink CurrentPageReport RowsPerPageDropdown"
                                   currentPageReportTemplate="Showing {first} to {last} of {totalRecords} books"
                        >
                            {visibleBookColumns.map((column) => {
                                if(column.field === 'hardcoverPrice' || column.field === 'paperbackPrice' || column.field === 'ebookPrice' || column.field === 'audiobookPrice') {
                                    return (
                                        <Column key={column.field} field={column.field} header={column.header} sortable
                                                body={(book)=> priceBodyTemplate(book, column.field)}/>
                                    );
                                }
                                return (<Column key={column.field} field={column.field} header={column.header} sortable/>);
                            })}
                            <Column body={editAndDeleteButtonTemplate}></Column>
                        </DataTable>
                    </>
                )}
            </div>

            {/** Edit Book Dialog **/}
            {book && (<Dialog visible={bookEditDialog} header="Book Details" modal onHide={() => setBookEditDialog(false)}
                              style={{width: '42rem'}} footer={editBookDialogFooter(book.bookID)}>
                <BookForm handleChange={(e: React.ChangeEvent<HTMLInputElement>) => {
                    setBook({...book, [e.currentTarget.id]: e.currentTarget.value} as Book)}} showImage={true} formik={formikEdit}/>
            </Dialog>)}

            {/** Delete Book Dialog **/}
            {book && (<Dialog visible={bookDeleteDialog} header="Confirm" modal onHide={() => setBookDeleteDialog(false)}
                              footer={deleteBookDialogFooter(book.bookID)} className="m-4" style={{width: '32rem'}}>
                <div className="confirmation-content">
                    {book && (
                        <span>
                            Are you sure you want to delete <b>{book.title}</b>?
                        </span>
                    )}
                </div>
            </Dialog>)}

            {/** Add Book Dialog **/}
            <Dialog onHide={() =>  setBookAddDialog(false)} header="Add a Book" modal visible={bookAddDialog}
                    style={{width: '42rem'}} footer={addBookDialogFooter}>
                <BookForm handleChange={(e: React.ChangeEvent<HTMLInputElement>) => {
                    setBookToAdd({...bookToAdd, [e.currentTarget.id]: e.currentTarget.value} as Book);
                }} showImage={false} validationSchema={validationSchema} isSubmitting={submitting} formik={formikAdd}/>
            </Dialog>

        </AppLayout>
    );
}

// Book form component (edit & add)
function BookForm(props: BookFormTemplate) {

    return (
        <>
            <div className="container-fluid">

                {props.showImage && props.formik && (<div className="d-flex justify-content-center align-items-center pb-3">
                    <img src={props.formik.values.image} alt={props.formik.values.title}/>
                </div>)}
                {!props.showImage && (
                    <div className="d-flex align-items-center pb-2">
                        <p className="lato-regular">A title, author, publisher, genre, page count, description, release date, and at least one price metric are required.</p>
                    </div>
                )}
                <div>
                    <form id="bookForm" onSubmit={props.formik.handleSubmit}>
                        <div className="mb-3 form-group">
                            <label htmlFor="title" className="form-label">Book Title</label>
                            <input type="text" className="form-control" id="title" placeholder="Title"
                                   value={props.formik.values.title} onChange={props.formik.handleChange}/>
                            {props.formik.errors.title && props.formik.touched.title ? (
                                <div className="error text-danger">{props.formik.errors.title}</div>
                            ) : null}
                        </div>
                        <div className="mb-3">
                            <label htmlFor="isbn10" className="form-label">ISBN-10</label>
                            <input type="text" className="form-control" id="isbn10" placeholder="ISBN-10"
                                   value={props.formik.values.isbn10} onChange={props.formik.handleChange}/>
                        </div>
                        <div className="mb-3">
                            <label htmlFor="isbn13" className="form-label">ISBN-13</label>
                            <input type="text" className="form-control" id="isbn13" placeholder="ISBN-13"
                                   value={props.formik.values.isbn13} onChange={props.formik.handleChange}/>
                        </div>
                        <div className="mb-3 form-group">
                            <label htmlFor="author" className="form-label">Author</label>
                            <input type="text" className="form-control" id="author" placeholder="Author"
                                   value={props.formik.values.author} onChange={props.formik.handleChange}/>
                            {props.formik.errors.author && props.formik.touched.author ? (
                                <div className="error text-danger">{props.formik.errors.author}</div>
                            ) : null}
                        </div>
                        <div className="mb-3">
                            <label htmlFor="publisher" className="form-label">Publisher</label>
                            <input type="text" className="form-control" id="publisher" placeholder="Publisher"
                                   value={props.formik.values.publisher} onChange={props.formik.handleChange}/>
                            {props.formik.errors.publisher && props.formik.touched.publisher ? (
                                <div className="error text-danger">{props.formik.errors.publisher}</div>
                            ) : null}
                        </div>
                        <div className="mb-3">
                            <label htmlFor="description" className="form-label">Description</label>
                            <input type="text" className="form-control" id="description" placeholder="Description"
                                   value={props.formik.values.description} onChange={props.formik.handleChange}/>
                        </div>
                        <div className="mb-3">
                            <label htmlFor="genre" className="form-label">Genre</label>
                            <input type="text" className="form-control" id="genre" placeholder="Genre"
                                   value={props.formik.values.genre} onChange={props.formik.handleChange}/>
                            {props.formik.errors.genre && props.formik.touched.genre ? (
                                <div className="error text-danger">{props.formik.errors.genre}</div>
                            ) : null}
                        </div>
                        <div className="mb-3">
                            <label htmlFor="image" className="form-label">Image Link</label>
                            <input type="text" className="form-control" id="image" placeholder="Image Link"
                                   value={props.formik.values.image} onChange={props.formik.handleChange}/>
                        </div>
                        <div className="mb-3">
                            <label htmlFor="language" className="form-label">Language</label>
                            <input type="text" className="form-control" id="language" placeholder="Language"
                                   value={props.formik.values.language} onChange={props.formik.handleChange}/>
                        </div>
                        <div className="mb-3">
                            <p className="form-label">Release Date</p>
                            <Calendar showButtonBar value={new Date(props.formik.values.releaseDate)} inputId="releaseDate"
                                      name="Release Date" dateFormat="mm/dd/yy" onChange={props.formik.handleChange}/>
                        </div>
                        <div className="mb-3">
                            <label htmlFor="pageCount" className="form-label">Pages</label>
                            <input type="number" className="form-control" id="pageCount" placeholder="Pages"
                                   value={props.formik.values.pageCount} onChange={props.formik.handleChange}/>
                            {props.formik.errors.pageCount && props.formik.touched.pageCount ? (
                                <div className="error text-danger">{props.formik.errors.pageCount}</div>
                            ) : null}
                        </div>
                        <div className="mb-3">
                            <label htmlFor="hardcoverPrice" className="form-label">Hardcover Price</label>
                            <input type="number" className="form-control" id="hardcoverPrice"
                                   placeholder="Hardcover Price" step="0.01" min="0.00"
                                   value={props.formik.values.hardcoverPrice} onChange={props.formik.handleChange}/>
                        </div>
                        <div className="mb-3">
                            <label htmlFor="paperbackPrice" className="form-label">Paperback Price</label>
                            <input type="number" className="form-control" id="paperbackPrice"
                                   placeholder="Paperback Price" step="0.01" min="0.00"
                                   value={props.formik.values.paperbackPrice} onChange={props.formik.handleChange}/>
                        </div>
                        <div className="mb-3">
                            <label htmlFor="ebookPrice" className="form-label">eBook Price</label>
                            <input type="number" className="form-control" id="ebookPrice"
                                   placeholder="eBook Price" step="0.01" min="0.00"
                                   value={props.formik.values.ebookPrice} onChange={props.formik.handleChange}/>
                        </div>
                        <div className="mb-3">
                            <label htmlFor="audiobookPrice" className="form-label">Audiobook Price</label>
                            <input type="number" className="form-control" id="audiobookPrice"
                                   placeholder="Audiobook Price" step="0.01" min="0.00"
                                   value={props.formik.values.audiobookPrice} onChange={props.formik.handleChange}/>
                        </div>
                        <div className="mb-3">
                            <label htmlFor="ratings" className="form-label">Rating</label>
                            <input type="number" className="form-control" id="ratings"
                                   placeholder="Rating" step="0.01" min="0.00"
                                   value={props.formik.values.ratings} onChange={props.formik.handleChange}/>
                        </div>
                        <div className="mb-3">
                            <label htmlFor="ratingsCount" className="form-label">Ratings</label>
                            <input type="number" className="form-control" id="ratingsCount"
                                   placeholder="Ratings" min="0" step="1"
                                   value={props.formik.values.ratingsCount} onChange={props.formik.handleChange}/>
                        </div>
                    </form>
                </div>
            </div>
        </>
    );
}

export default App;
