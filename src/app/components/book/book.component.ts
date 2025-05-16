import { Component, HostListener, Input, OnInit, TemplateRef } from '@angular/core';
import { AbstractControl, FormArray, FormBuilder, FormGroup, ValidationErrors, ValidatorFn, Validators } from '@angular/forms';

import { Book } from '../../models/book.model';
import { DocViewerExtension } from '../../models/constants.model';
import { BookService } from '../../services/book.service';

import { StorageService } from '../../services/storage.service';


@Component({
  selector: 'app-book',
  templateUrl: './book.component.html',
  styleUrls: ['./book.component.scss']
})
export class BookComponent implements OnInit {

  @Input() searchString?: string;
  books: Book[] = [];
  isModalOpen: boolean = false;
  pdfViewer!: string;
  selectedBook?: Book;
  temptBooks: Book[] = [];
  showClear: boolean = false;
  isMobile: boolean = false;
  isLoading: boolean = true;
  isAddBook: boolean = false;
  bookForm: FormGroup;

  constructor(
    private storageServ: StorageService,
    private bookService: BookService,
    private fb: FormBuilder,
  ) {
    this.checkScreenSize();
    this.bookForm = this.fb.group({
      bookTitle: ['', Validators.required],
      subTitle: [''],
      description: [''],
      authors: this.fb.array([this.createAuthor()]),  // Dynamic authors
      saleStatus: [''],
      price: [''],
      categories: this.fb.array([this.createCategory()]),  // Dynamic categories
      thumbnailImageUrl: ['', [Validators.required, this.urlValidator()]],
      publishDate: ['', Validators.required],
      publisher: ['', Validators.required],
      previewLink: ['', Validators.required],
      pagecount: ['', Validators.required],
    });

  }

  urlValidator(): ValidatorFn {
    return (control: AbstractControl): ValidationErrors | null => {
      const urlPattern = /^(https?:\/\/)?([a-zA-Z0-9_-]+\.)+[a-zA-Z]{2,6}(:\d+)?(\/\S*)?$/;
      const isValidUrl = urlPattern.test(control.value);
      return isValidUrl ? null : { invalidUrl: true };
    };
  }

  // Handle form submission
  onSubmit() {
    if (this.bookForm.valid) {
      this.isLoading = true;
      let addedBook: Book = {
        kind: "books#volume",
        id: this.bookService.newGuid(),
        etag: '',
        selfLink: '',
        volumeInfo: {
          title: this.bookForm.get('bookTitle')?.value,
          publishedDate: this.bookForm.get('publishDate')?.value,
          publisher: this.bookForm.get('publisher')?.value,
          authors: this.bookForm.get('authors')?.value.map((m: { name: any; }) => m.name),
          subtitle: this.bookForm.get('subTitle')?.value,
          description: this.bookForm.get('description')?.value,
          imageLinks: {
            smallThumbnail: this.bookForm.get('thumbnailImageUrl')?.value,
            thumbnail: this.bookForm.get('thumbnailImageUrl')?.value,
          },
          previewLink: this.bookForm.get('previewLink')?.value,
          categories: this.bookForm.get('categories')?.value.map((m: { category: any; }) => m.category),
          pageCount: this.bookForm.get('pagecount')?.value,
        },
        saleInfo: {
          country: 'IN',
          saleability: this.bookForm.get('saleStatus')?.value,
          isEbook: false,
          retailPrice: {
            amount: Number(this.bookForm.get('price')?.value) > 0 ? Number(this.bookForm.get('price')?.value) : null,
            currencyCode: 'INR'
          },
        }
      }
      this.books.unshift(addedBook);
      this.isAddBook = false;
      this.isLoading = false;
    } else {
      console.log('Form is invalid');
    }
  }

  get authors() {
    return (this.bookForm.get('authors') as FormArray);
  }

  createAuthor() {
    return this.fb.group({
      name: ['', Validators.required],
    });
  }

  addAuthor() {
    this.authors.push(this.createAuthor());
  }
  // Add new category
  get categories() {
    return (this.bookForm.get('categories') as FormArray);
  }

  createCategory() {
    return this.fb.group({
      category: ['', Validators.required],
    });
  }

  addCategory() {
    this.categories.push(this.createCategory());
  }

  removeItem(type: string, index: number) {
    if (type === 'author') {
      this.authors.removeAt(index);
    } else if (type === 'category') {
      this.categories.removeAt(index);
    }
  }



  ngOnInit() {
    this.isLoading = true;
    this.storageServ.get<Book[]>('books').then(async books => {
      if (books?.find(b => b.isAddedToWIshlist === true)) {
        this.temptBooks = books as Book[];
        this.books = this.temptBooks;
        this.isLoading = false;
      } else {
        this.getBookDetails('fouling');
      }
    });
  }

  getBookDetails(input: string) {
    this.bookService.getBookDetails(input).subscribe((books: Book[]) => {
      this.books = books;
      this.temptBooks = [...this.temptBooks, ...this.books];
      this.temptBooks = [...new Map(this.temptBooks.map(t => [t.id, t])).values()];
      this.storageServ.Store('books', this.temptBooks);
      this.isLoading = false;
    });
  }

  ngOnChanges() {
    // this.isLoading = true;
    if (this.searchString?.length) {
      this.getBookDetails(this.searchString ?? '' as string);
    } else {
      this.books = this.temptBooks;
      this.isLoading = false;
    }
  }

  onModalOpen(book: Book) {
    this.selectedBook = book;
    this.isModalOpen = true;
  }

  // This method closes the modal
  onModalClose() {
    this.isModalOpen = false;  // Close the modal
  }

  canFileRenderInExtension(filePath?: string): boolean {
    const extension = filePath?.split('.').pop()?.toLowerCase();
    return extension
      ? Object.values(DocViewerExtension).includes(extension as DocViewerExtension)
      : false;
  }

  onClickMore(url?: string) {
    window.open(url, "_blank");
  }

  onClickDownload(url?: string) {
    this.pdfViewer = url as string;
  }

  onPdfViewerClose() {
    this.pdfViewer = '';
    this.isAddBook = false;
  }

  onClickBuy() {
    window.open(this.selectedBook?.saleInfo?.buyLink, "_blank");
  }

  onClickFreeSample() {
    window.open(this.selectedBook?.accessInfo?.webReaderLink, "_blank");
  }

  onClickClear() {
    this.books = this.temptBooks;
    this.showClear = false;
  }

  onClickWishList() {
    this.books = this.temptBooks.filter(b => b.isAddedToWIshlist);
    this.showClear = !this.showClear;
  }

  onAddWishlist(book: any) {
    book.isAddedToWIshlist = !book.isAddedToWIshlist;
    this.storageServ.Store('books', this.books);
  }

  onAddBook() {
    this.bookForm.reset();
    this.isAddBook = true;
  }

  checkScreenSize() {
    this.isMobile = window.innerWidth < 768;
  }

  @HostListener('window:resize', ['$event'])
  onResize() {
    this.checkScreenSize();
  }
}
