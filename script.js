const root = document.querySelector('.root');
const placesList = root.querySelector('.places-list');
const popupButton = root.querySelector('.popup__button');
const popup = root.querySelector('.popup');
const form = document.forms.new;
const name = form.elements.name;
const link = form.elements.link;
const zoom = root.querySelector('.zoom');
const zoomClose = root.querySelector('.zoom__close');
const edit = root.querySelector('.edit');
const editButton = root.querySelector('.edit__button');
const formUser = document.forms.user;
const userName = formUser.elements.name1;
const job = formUser.elements.job;


class Card {
  constructor(nameValue, linkValue) {
      this.nameValue = nameValue;
      this.linkValue = linkValue;
      this.element = null;
      this.remove = this.remove.bind(this);
      this.zoom = this.zoom.bind(this);
      this.addListeners();        
    }
  getElement() {
    if(!this.element) {
      this.create();
    }
    return this.element; 
  }
      
  create() {
    const imageContainer = document.createElement('div');
    const deleteButtonElement = document.createElement('button');
    imageContainer.appendChild(deleteButtonElement);
      
    imageContainer.classList.add('place-card__image');
    imageContainer.setAttribute('style', `background-image: url(${this.linkValue})`);
    deleteButtonElement.classList.add('place-card__delete-icon');
      
    const descriptionContainer = document.createElement('div');
    const descriptionElement = document.createElement('h3');
    const likeButtonElement = document.createElement('button');
    descriptionContainer.appendChild(descriptionElement);
    descriptionContainer.appendChild(likeButtonElement);
      
    descriptionContainer.classList.add('place-card__description');
    descriptionElement.classList.add('place-card__name');
    descriptionElement.textContent = this.nameValue;
    likeButtonElement.classList.add('place-card__like-icon');

    const placeContainer = document.createElement('div');
    placeContainer.appendChild(imageContainer);
    placeContainer.appendChild(descriptionContainer);
      
    placeContainer.classList.add('place-card');
      
    this.element = placeContainer;
  }
  remove() {
    event.stopPropagation();
    this.element.remove();
    this.element = null;
    this.getElement().querySelector('.place-card__image').removeEventListener('click', this.zoom);
    this.getElement().querySelector('.place-card__delete-icon').removeEventListener('click', this.remove);

  }
  like() {
    event.target.classList.toggle('place-card__like-icon_liked');
  }
  zoom() {
    zoom.classList.add('zoom_is-opened');
    zoom.querySelector('.zoom__content').setAttribute('style', `background-image: url(${this.linkValue})`);
    // Можно улучшить запись атрибутов доступна в более короткой форме
    // elem.style.color = 'red'
  }
  addListeners() {
    this.getElement().querySelector('.place-card__like-icon').addEventListener('click', this.like);
    this.getElement().querySelector('.place-card__image').addEventListener('click', this.zoom);
    this.getElement().querySelector('.place-card__delete-icon').addEventListener('click', this.remove);
    zoomClose.addEventListener('click', () => {
      zoom.classList.remove('zoom_is-opened');
    });
  }
}

class CardList {
  constructor(container) {
    this.container = container; 
    this.handleAddPlace = this.handleAddPlace.bind(this);
  }
  handleAddPlace(event){
    event.preventDefault(); 
    const card = new Card(name.value, link.value);
    this.container.appendChild(card.getElement());
     
    form.reset();
    popup.classList.remove('popup_is-opened');
    popupButton.setAttribute('disabled', true);
    popupButton.classList.add('popup__button_disabled');
  }
  startPlaces(cards) {
    cards.forEach( (item) => {
    const card = new Card(item.name, item.link);
    this.container.appendChild(card.getElement());
    })
  }
}

const cardList = new CardList(placesList);

class Popup {
open() {
  popup.classList.add('popup_is-opened');
}
close() {
  popup.classList.remove('popup_is-opened');
}
}
const newPopup = new Popup;

root.querySelector('.user-info__button').addEventListener('click', newPopup.open); 
popup.querySelector('.popup__close').addEventListener('click', newPopup.close);   

class Edit {
open() {
  edit.classList.add('edit_is-opened');

  userName.value = root.querySelector('.user-info__name').textContent;
  job.value = root.querySelector('.user-info__job').textContent;
   fieldValidation();
}
close() {
  edit.classList.remove('edit_is-opened'); 

  root.querySelector('#error-name1').textContent = '';
  root.querySelector('#error-job').textContent = '';
}
}
const newEdit = new Edit;

root.querySelector('.user-info__profile').addEventListener('click', newEdit.open);
root.querySelector('.edit__close').addEventListener('click', newEdit.close);

function fieldValidation() {
if (userName.value.length < 2 || job.value.length < 2) {
  editButton.setAttribute('disabled', true);
  editButton.classList.add('edit__button_disabled');
}else if(userName.value.length > 30 || job.value.length > 30) {
  editButton.setAttribute('disabled', true);
  editButton.classList.add('edit__button_disabled');
}else{
  editButton.removeAttribute('disabled');
  editButton.classList.remove('edit__button_disabled');
}
}

function formAddCardInputHandler() {
const name = event.currentTarget.elements.name;
const link = event.currentTarget.elements.link;
 if (name.value.length === 0 || link.value.length === 0) {
  popupButton.setAttribute('disabled', true);
  popupButton.classList.add('popup__button_disabled'); 
} else {
  popupButton.removeAttribute('disabled');
  popupButton.classList.remove('popup__button_disabled');
}
}

function replacesDataUser (event) {
event.preventDefault();

root.querySelector('.user-info__name').textContent = userName.value;
root.querySelector('.user-info__job').textContent = job.value;
formUser.reset();
edit.classList.remove('edit_is-opened');
editButton.setAttribute('disabled', true);
editButton.classList.add('edit__button_disabled');
}

function userNameHandler() {
checksConditions(userName, root.querySelector('#error-name1'));
}
function jobHandler() {
 checksConditions(job, root.querySelector('#error-job')); 
}
function checksConditions(elem, btn) {
if (elem.value.length === 0) {
  btn.textContent = 'Это обязательное поле';
}else if(elem.value.length === 1 || elem.value.length > 30){
  btn.textContent = 'Должно быть от 2 до 30 символов';
}else{
  btn.textContent = '';
}
}

form.addEventListener('input', formAddCardInputHandler);
popupButton.addEventListener('click', cardList.handleAddPlace);
editButton.addEventListener('click', replacesDataUser);
formUser.addEventListener('input', fieldValidation);
userName.addEventListener('input', userNameHandler);
job.addEventListener('input', jobHandler);


 class Api {
  constructor(url, token) {
    this.url = url;
    this.token = token;
  }
  getInfo() {
    return fetch(`${this.url}/cohort2/users/me`, {
      method: 'GET',
      headers: {
        authorization: this.token,
        'Content-Type': 'application/json'
      }
    })
    .then(res => {
      if (res.ok) {
        return res.json();
      }
      return Promise.reject(`Ошибка: ${res.status}`);
    })
    .catch((err) => {
      console.log(err); 
    });
  }
  getCards() {
    return fetch(`${this.url}/cohort2/cards`, {
      method: 'GET',
      headers: {
        authorization: this.token,
        'Content-Type': 'application/json'
      }
    })
    .then(res => {
      if (res.ok) {
        return res.json();
      }
      return Promise.reject(`Ошибка: ${res.status}`);
    })
    .catch((err) => {
      console.log(err); 
    });
  }
  getUser() {
    return fetch(`${this.url}/cohort2/users/me`, {
      method: 'PATCH',
      headers: {
          authorization: this.token,
          'Content-Type': 'application/json'
      },
      body: JSON.stringify({
          name: root.querySelector('.user-info__name').textContent, 
          about: root.querySelector('.user-info__job').textContent
      })
    })
    .then(res => {
      if (res.ok) {
        return res.json();
      }
      return Promise.reject(`Ошибка: ${res.status}`);
    })
    .catch((err) => {
      console.log(err); 
    });
  }
}

const api = new Api('http://95.216.175.5', 'ae632dd6-dcd7-47f5-b3e0-d4af557ae8cd');
api.getInfo().then((result) => {
  root.querySelector('.user-info__name').textContent = result.name;
  root.querySelector('.user-info__job').textContent = result.about;
})
api.getCards().then((cards) => {
  cardList.startPlaces(cards);
})
api.getUser().then((info) => {
  root.querySelector('.user-info__name').textContent = info.name;
  root.querySelector('.user-info__job').textContent = info.about;
})

   // Можно улучшить в целом верно, данные лучше передавать параметрами
          // в метод из переменных или можно завести класс или простой объект 
          // const User = { id:'', name: '', about:'' } 
          // и обновлять данные через него это предпочтительнее использованию
          // querySelector внутри запросов

          /**
           * const userName = root.querySelector('.user-info__name').textContent
           * const userAbout = root.querySelector('.user-info__job').textContent
           
           * api.getUser(userName, userAbout)
           * 
           * getUser(name, about) {
           *       body: JSON.stringify({
                   name, 
                   about
                })
           * }
           */

          
          
          // Надо исправить - передачу данных в другие классы
          // данные из запросов getInfo и getUser, выводятся в консоль, 
          // в элементы страницы не передаются. (обязательно к исправлению)

          // кроме cardList - у него только startPlaces можно выполнять
          // прямо в конструкторе, а так - корректно

          /** пример оптимизации (не обязательно)
           * class CardList {
              constructor(container, cards) {
                this.container = container; 
                this.cards = cards; 
                this.handleAddPlace = this.handleAddPlace.bind(this);
                this.startPlaces() // удобнее вызывать в самом классе
              }

              startPlaces() {
                this.cards.forEach((item) => {
                  const card = new Card(item.name, item.link);
                  this.container.appendChild(card.getElement());
              })
            }

              -----

              api.getCards().then((cards) => {
                if (cards && cards.length > 0) {
                  new cardList(placesList, cards)
                  передача массива карточек и запись в поля класса
                  улучшает читаемость кода
                }
              })
           */

          