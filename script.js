const books = [];
const RENDER_EVENT = 'render-book';

function generateId() {
    return +new Date();
}

function generateBookObject(id, title, author, year, isCompleted) {
    return {
        id,
        title,
        author,
        year: parseInt(year),
        isCompleted
    }
}

function findBook(bookId) {
    for (const bookItem of books) {
        if (bookItem.id === bookId) {
            return bookItem;
        }
    }
    return null;
}

function findBookIndex(bookId) {
    for (const index in books) {
        if (books[index].id === bookId) {
            return index;
        }
    }

    return -1;
}

function makeBook(bookObject) {
    const { id, title, author, year, isCompleted } = bookObject;

    const texttitle = document.createElement('h2');
    texttitle.innerText = title;

    const textauthor = document.createElement('p');
    textauthor.innerText = author;

    const textyear = document.createElement('p');
    textyear.innerText = year;

    const textContainer = document.createElement('div');
    textContainer.classList.add('inner');
    textContainer.append(texttitle, textauthor, textyear);

    const container = document.createElement('div');
    container.classList.add('item', 'shadow');
    container.append(textContainer);
    container.setAttribute('id', `book-${id}`);

    if (isCompleted) {
        const undoButton = document.createElement('button')
        undoButton.classList.add('undo-button');

        undoButton.addEventListener('click', function () {
            undoTaskFromCompleted(id);
        });

        const trashButton = document.createElement('button');
        trashButton.classList.add('trash-button');

        trashButton.addEventListener('click', function () {
            removeTaskFromCompleted(id);
        });

        container.append(undoButton, trashButton);
    } else {
        const checkButton = document.createElement('button');
        checkButton.classList.add('check-button');

        checkButton.addEventListener('click', function () {
            addTaskToCompleted(id);
        });

        const trashButton = document.createElement('button');
        trashButton.classList.add('trash-button');

        trashButton.addEventListener('click', function () {
            removeTaskFromCompleted(id);
        });


        container.append(checkButton, trashButton);
    }

    return container;
};

const SAVED_EVENT = 'saved-book';
const STORAGE_KEY = 'BOOK_APPS';

function isStorageExist() {
    if (typeof (Storage) === undefined) {
        alert('Browser kamu tidak mendukung local storage');
        return false;
    }
    return true;
}

function saveData() {
    if (isStorageExist()) {
        const parsed = JSON.stringify(books);
        localStorage.setItem(STORAGE_KEY, parsed);
        document.dispatchEvent(new Event(SAVED_EVENT));
    }
}

function addBook() {
    const titleBook = document.getElementById('title').value;
    const authorBook = document.getElementById('author').value;
    const yearBook = document.getElementById('year').value;
    const completedBook = document.getElementById('readedBook').checked;

    const generatedID = generateId();
    const bookObject = generateBookObject(generatedID, titleBook, authorBook, yearBook, completedBook);
    books.push(bookObject);

    document.dispatchEvent(new Event(RENDER_EVENT));
    saveData();
};

function addTaskToCompleted(bookId) {
    const bookTarget = findBook(bookId);

    if (bookTarget == null) return;

    bookTarget.isCompleted = true;
    document.dispatchEvent(new Event(RENDER_EVENT));
    saveData();
}

function removeTaskFromCompleted(bookId) {
    const bookTarget = findBookIndex(bookId);

    if (bookTarget === -1) return;

    books.splice(bookTarget, 1);
    document.dispatchEvent(new Event(RENDER_EVENT));
    saveData();
}

function undoTaskFromCompleted(bookId) {
    const bookTarget = findBook(bookId);

    if (bookTarget == null) return;

    bookTarget.isCompleted = false;
    document.dispatchEvent(new Event(RENDER_EVENT));
    saveData();
}

function loadDataFromStorage() {
    const serializedData = localStorage.getItem(STORAGE_KEY);
    let data = JSON.parse(serializedData);

    if (data !== null) {
        for (const book of data) {
            books.push(book);
        }
    }

    document.dispatchEvent(new Event(RENDER_EVENT));
}

function searchBooks() {
    const title = document.getElementById('searchBook').value;
    const searchedBook = books.filter(function (book) {
        const bookName = book.title.toLowerCase();
        return bookName.includes(title.toLowerCase());
    });
    return searchedBook;
}

searchSubmit.addEventListener('click', function (event) {
    event.preventDefault();
    searchBooks();
    document.dispatchEvent(new Event(RENDER_EVENT));
});


document.addEventListener('DOMContentLoaded', function () {
    const submitForm = document.getElementById('form');
    submitForm.addEventListener('submit', function (event) {
        event.preventDefault();
        addBook();
    })

    if (isStorageExist()) {
        loadDataFromStorage();
    }
});

document.addEventListener(RENDER_EVENT, function () {
    const uncompletedBOOKSList = document.getElementById('uncompleted-books');
    const completedBOOKList = document.getElementById('completed-books');

    uncompletedBOOKSList.innerHTML = '';
    completedBOOKList.innerHTML = '';

    for (const bookItem of searchBooks()) {
        const bookElement = makeBook(bookItem);
        if (!bookItem.isCompleted) {
            uncompletedBOOKSList.append(bookElement);
        } else {
            completedBOOKList.append(bookElement);
        }
    }
});

document.addEventListener(SAVED_EVENT, function () {
    console.log(localStorage.getItem(STORAGE_KEY));
});
