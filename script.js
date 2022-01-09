let bookLibrary = [
	new Book("Ulysses", "James Joyce", "Modernist novel", 730, "Read"),
	new Book(
		"Harry Potter and the Sorcerer's Stone",
		"J.K. Rowling",
		"Fantasy",
		"234",
		"Unread"
	),
];

const titleField = document.querySelector("#title");
const authorField = document.querySelector("#author");
const genreField = document.querySelector("#genre");
const pageField = document.querySelector("#pages");
const statusBtn = document.querySelectorAll("input[name=read-status]");

function initializeEvents() {
	const addBookModalBtn = document.querySelector("#add-book-modal");
	addBookModalBtn.addEventListener("click", setSubmitBtnValue);

	const addBookBtn = document.querySelector("#add-book");
	addBookBtn.addEventListener("click", toggleModalBox);

	const closeBtn = document.querySelector("#close-button");
	closeBtn.addEventListener("click", () => {
		toggleModalBox();
		emptyField();
	});

	window.addEventListener("click", windowOnClick);
}

//modal box
function toggleModalBox() {
	const modalBox = document.querySelector(".modal-box");
	modalBox.classList.toggle("show-modal");
}

//Book constructor
function Book(title, author, genre, pages, status) {
	this.title = title;
	this.author = author;
	this.genre = genre;
	this.pages = pages;
	this.status = status;
}

Book.prototype.changeStatus = function (e) {
	if (this.status === "Read") {
		this.status = "Unread";
	} else {
		this.status = "Read";
	}
	removeAllCards();
	showBookLibrary();
	updateReadCounter();
};

function setSubmitBtnValue() {
	let statusBtnValue;
	if (statusBtn[0].checked) {
		statusBtnValue = statusBtn[0].value;
	} else if (statusBtn[1].checked) {
		statusBtnValue = statusBtn[1].value;
	} else {
		statusBtnValue = "";
	}
	return checkIfEmptyField(statusBtnValue);
}

function addBookToLibrary(statusBtnValue) {
	//if submit button is pressed add the book to bookLibrary
	bookLibrary.push(
		new Book(
			titleField.value,
			authorField.value,
			genreField.value,
			pageField.value,
			statusBtnValue
		)
	);

	addBookLibrarytoDom();
	emptyField();
}

function windowOnClick(e) {
	const modalBox = document.querySelector(".modal-box");
	if (e.target === modalBox) {
		toggleModalBox();
		emptyField();
	}
}

//check empty field
function checkIfEmptyField(statusBtnValue) {
	if (
		!titleField.value ||
		!authorField.value ||
		!pageField.value ||
		!genreField.value ||
		!statusBtnValue
	) {
		alert("Error");
	} else {
		addBookToLibrary(statusBtnValue);
		toggleModalBox();
	}
}

//empty field when closed
function emptyField() {
	titleField.value = "";
	authorField.value = "";
	pageField.value = "";
	genreField.value = "";
	statusBtn.forEach((status) => (status.checked = false));
}

function addCardtoDom(libraryIndex, title, author, genre, pages, status) {
	const card = document.createElement("div");
	card.classList.toggle("cards");

	if (status === "Read") {
		card.classList.toggle("read-card");
	} else {
		card.classList.toggle("unread-card");
	}
	card.dataset.libraryIndex = libraryIndex;

	const cardContainer = document.querySelector("#cards-container");
	cardContainer.appendChild(card);

	const cardContents = document.createElement("div");
	cardContents.classList.toggle("card-contents");
	card.appendChild(cardContents);

	const firstRowCardContent = document.createElement("div");
	firstRowCardContent.classList.toggle("first-row-card-content");
	cardContents.appendChild(firstRowCardContent);

	const secondRowCardContent = document.createElement("div");
	secondRowCardContent.classList.toggle("second-row-card-content");
	cardContents.appendChild(secondRowCardContent);

	const firstColumnCardContent = document.createElement("div");
	firstColumnCardContent.classList.toggle("first-column-card-content");
	secondRowCardContent.appendChild(firstColumnCardContent);

	const secondColumnCardContent = document.createElement("div");
	secondColumnCardContent.classList.toggle("second-column-card-content");
	secondRowCardContent.appendChild(secondColumnCardContent);

	const titleCard = document.createElement("p");
	titleCard.classList.toggle("title-card");
	titleCard.textContent = title;
	firstRowCardContent.appendChild(titleCard);

	const divClose = document.createElement("div");
	divClose.classList.toggle("delete-card");
	divClose.textContent = "X";
	divClose.addEventListener("click", removeCard);
	firstRowCardContent.appendChild(divClose);

	const authorCard = document.createElement("p");
	authorCard.classList.toggle("author-card");
	authorCard.textContent = `Author: ${author}`;
	firstColumnCardContent.appendChild(authorCard);

	const genreCard = document.createElement("p");
	genreCard.classList.toggle("genre-card");
	genreCard.textContent = `Genre: ${genre}`;
	firstColumnCardContent.appendChild(genreCard);

	const pageCard = document.createElement("p");
	pageCard.classList.toggle("page-card");
	pageCard.textContent = `${pages} pages`;
	firstColumnCardContent.appendChild(pageCard);

	const markStatusBtn = document.createElement("button");
	if (status === "Read") {
		markStatusBtn.textContent = "Mark as Unread";
	} else {
		markStatusBtn.textContent = "Mark as Read";
	}
	markStatusBtn.addEventListener(
		"click",
		bookLibrary[libraryIndex].changeStatus.bind(bookLibrary[libraryIndex])
	);

	markStatusBtn.classList.toggle("mark-status-btn");
	secondColumnCardContent.appendChild(markStatusBtn);
}

// show the added book
function addBookLibrarytoDom() {
	addCardtoDom(
		bookLibrary.length - 1,
		bookLibrary[bookLibrary.length - 1].title,
		bookLibrary[bookLibrary.length - 1].author,
		bookLibrary[bookLibrary.length - 1].genre,
		bookLibrary[bookLibrary.length - 1].pages,
		bookLibrary[bookLibrary.length - 1].status
	);
	updateReadCounter();
}

function removeCard(e) {
	const index = e.target.parentNode.parentNode.parentNode.dataset.libraryIndex;
	bookLibrary.splice(index, 1);
	e.target.parentNode.parentNode.parentNode.remove();
	updateReadCounter();
}

function updateReadCounter() {
	const statusCounter = bookLibrary.reduce(statusCountFunc, {});
	function statusCountFunc(obj, book) {
		if (!obj[book.status]) {
			obj[book.status] = 0;
		}
		obj[book.status]++;
		return obj;
	}

	if (!statusCounter.Read) {
		statusCounter.Read = 0;
	} else if (!statusCounter.Unread) {
		statusCounter.Unread = 0;
	}

	const readCountId = document.querySelector("#read-counter");
	readCountId.textContent = statusCounter.Read;
	const unreadCountId = document.querySelector("#unread-counter");
	unreadCountId.textContent = statusCounter.Unread;
}

const applySortBtn = document.querySelector("#apply-sort");
applySortBtn.addEventListener("click", sortLibrary);

//sort array
function sortLibrary() {
	const sortIndex = document.querySelector("#sort").selectedIndex;
	const indexText = document
		.querySelector("#sort")
		.options[sortIndex].text.toLowerCase();
	console.log(indexText);
	bookLibrary.sort(function (a, b) {
		let propA = a[indexText].toUpperCase();
		let propB = b[indexText].toUpperCase();
		if (propA > propB) {
			return 1;
		} else if (propA < propB) {
			return -1;
		} else {
			return 0;
		}
	});
	removeAllCards();
	showBookLibrary();
}

function removeAllCards() {
	const cards = document.querySelectorAll(".cards");
	cards.forEach((card) => card.remove());
}

//show the elements of array
function showBookLibrary() {
	let i = 0;
	for (let book of bookLibrary) {
		addCardtoDom(
			i++,
			book.title,
			book.author,
			book.genre,
			book.pages,
			book.status
		);
	}
}

showBookLibrary();
updateReadCounter();
initializeEvents();
