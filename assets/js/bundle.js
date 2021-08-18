(function(){function r(e,n,t){function o(i,f){if(!n[i]){if(!e[i]){var c="function"==typeof require&&require;if(!f&&c)return c(i,!0);if(u)return u(i,!0);var a=new Error("Cannot find module '"+i+"'");throw a.code="MODULE_NOT_FOUND",a}var p=n[i]={exports:{}};e[i][0].call(p.exports,function(r){var n=e[i][1][r];return o(n||r)},p,p.exports,r,e,n,t)}return n[i].exports}for(var u="function"==typeof require&&require,i=0;i<t.length;i++)o(t[i]);return o}return r})()({1:[function(require,module,exports){

const listModule = require('./list');
const cardModule = require('./card');
const tagModule = require('./tag');

const app = {

  base_url: 'http://localhost:5050',

  defaultErrorMessage: 'Désolé un problème est survenu, veuillez réessayer ultérieurement',


  init: function () {
    console.log('app.init !');

    listModule.setBaseUrl(app.base_url);
    cardModule.setBaseUrl(app.base_url);
    tagModule.setBaseUrl(app.base_url);


    app.addListenerToActions();
    listModule.getListsFromAPI();
    tagModule.getTagsFromAPI();
  },

  addListenerToActions: function () {
    const addListButton = document.getElementById('addListButton');
    addListButton.addEventListener('click', listModule.showAddListModal);

    const editTagsButton = document.getElementById('editTagsButton');
    console.log(editTagsButton);
    editTagsButton.addEventListener('click', tagModule.showEditTagsModal);

    const closeModalButtons = document.querySelectorAll('.close');
    for (const button of closeModalButtons) {
      button.addEventListener('click', app.hideModals);
    }

    const addListForm = document.querySelector('#addListModal form');
    addListForm.addEventListener('submit', async function(event){
      event.preventDefault();
      await listModule.handleAddListForm(event);
      app.hideModals();
    });

    const addCardButtons = document.querySelectorAll('.add-card-button');
    for (const button of addCardButtons) {
      button.addEventListener('click', cardModule.showAddCardModal);
    };

    const addCardForm = document.querySelector('#addCardModal form');
    addCardForm.addEventListener('submit', async function(event){
      event.preventDefault();
      await cardModule.handleAddCardForm(event);
      app.hideModals();
    });

    const editTagForm = document.getElementById('newTagForm');
    editTagForm.addEventListener('submit', async function(event){
      event.preventDefault();
      await tagModule.handleAddTagForm(event);
      app.hideModals();
    });
  },

  hideModals: function () {
    const modals = document.querySelectorAll('.modal');
    for (const modal of modals) {
      modal.classList.remove('is-active');
    }
  }

};

document.addEventListener('DOMContentLoaded', app.init);
},{"./card":2,"./list":3,"./tag":4}],2:[function(require,module,exports){
const cardModule = {


    defaultErrorMessage: 'Désolé un problème est survenu avec les cartes, veuillez réessayer ultérieurement',

    setBaseUrl: function (base_url) {
        cardModule.card_base_url = base_url + '/cards'
    },

    showAddCardModal: function (event) {
        const addCardModal = document.getElementById('addCardModal');
        addCardModal.classList.add('is-active');
        const currentList = event.target.closest('.panel');
        const listId = currentList.getAttribute('list-id');
        const listIdField = addCardModal.querySelector('[name="list_id"]');
        listIdField.value = listId;
    },

    makeCardInDOM: function (card) {
        const cardTemplate = document.getElementById('template-card');
        const cardTemplateContent = cardTemplate.content;
        const newCard = document.importNode(cardTemplateContent, true);

        const newCardContent = newCard.querySelector('.content');
        newCardContent.textContent = card.content;

        const listContainer = document.querySelector('[list-id="' + card.list_id + '"] .panel-block');

        const newCardBox = newCard.querySelector('.box');
        newCardBox.style.backgroundColor = card.color;

        newCardBox.setAttribute('card-id', card.id);
        newCardBox.querySelector('input[name=id]').value = card.id;
        newCardBox.querySelector('textarea[name=content]').textContent = card.content;

        const editButton = newCardBox.querySelector('.card-edit');
        editButton.addEventListener('click', cardModule.handleCardContentEdit);

        const editForm = newCardBox.querySelector('form');
        editForm.addEventListener('submit', cardModule.handleEditCardForm);

        const deleteButton = newCardBox.querySelector('.card-delete');
        deleteButton.addEventListener('click', cardModule.handleCardDelete);

        listContainer.append(newCard);
    },

    handleCardContentEdit: function (event) {
        const currentCard = event.target.closest('.view-card');
        currentCard.classList.add('is-hidden');
        const form = currentCard.nextElementSibling;
        form.classList.remove('is-hidden');
    },

    handleCardDelete: async function (event) {
        const currentCardBox = event.target.closest('.box');
        const cardId = currentCardBox.getAttribute('card-id');
        const cardContent = currentCardBox.querySelector('.content').textContent;

        if (!confirm(`Êtes-vous sûr de vouloir supprimer la carte "${cardContent}" ?`)) {
            return;
        }

        try {
            const response = await fetch(`${cardModule.card_base_url}/${cardId}`, {
                method: 'DELETE'
            });
            const validOrError = await response.json();

            if (response.status !== 200) {
                throw validOrError;
            }

            currentCardBox.remove();
        } catch (error) {
            alert(cardModule.defaultErrorMessage);
            console.error(error);
        }
    },

    handleAddCardForm: async function (event) {

        console.log(event.target);

        const formData = new FormData(myFormFromDOM);

        try {

            const response = await fetch(
                cardModule.card_base_url,
                {
                    method: 'POST',
                    body: formData,

                }
            );

            const cardOrError = await response.json();

            if (response.status !== 200) {
                throw cardOrError;
            }

            cardModule.makeCardInDOM(cardOrError);
        } catch (error) {
            alert(cardModule.defaultErrorMessage);
            console.error(error);
        }
    },

    handleEditCardForm: async function (event) {
        const myForm = event.target;
        try {
            event.preventDefault();

            const formData = new FormData(event.target);

            const response = await fetch(`${cardModule.card_base_url}/${formData.get('id')}`, {
                method: 'PATCH',
                body: formData
            });

            const cardOrError = await response.json();

            if (response.status !== 200) {
                throw cardOrError;
            }

            myForm.classList.add('is-hidden');


            const currentCard = event.target.closest('.box').querySelector('.view-card');
            currentCard.querySelector('.content').textContent = cardOrError.content;
            currentCard.classList.remove('is-hidden');

        } catch (error) {
            alert(cardModule.defaultErrorMessage);
            console.error(error);
        }
    }

};

module.exports = cardModule;
},{}],3:[function(require,module,exports){
const cardModule = require('./card');

const listModule = {

  defaultErrorMessage: 'Désolé un problème est survenu avec les listes, veuillez réessayer ultérieurement',

  setBaseUrl: function (base_url) {
    listModule.list_base_url = base_url + '/lists'
  },

  showAddListModal: function () {
    const addListModal = document.getElementById('addListModal');
    addListModal.classList.add('is-active');
  },

  getListsFromAPI: async function () {
    try {

      const response = await fetch(listModule.list_base_url);

      if (response.status !== 200) {
        const error = await response.json();
        throw error;
      }

      const lists = await response.json();
      for (const list of lists) {

        listModule.makeListInDOM(list.name, list.id);
        for (const card of list.cards) {
          cardModule.makeCardInDOM(card);
        }
      }
      const cardList = document.querySelector('.card-lists');
      new Sortable(cardList, {
        onEnd: listModule.handleDropList
      });

    } catch (error) {
      alert(listModule.defaultErrorMessage);
      console.error(error);
    }
  },

  handleDropList: function (event) {
    listModule.updateAllLists();
  },

  updateAllLists: async function () {

    const lists = document.querySelectorAll('[list-id]');
    lists.forEach((list, listIndex) => {
      const listId = list.getAttribute('list-id');
      const position = listIndex
      const formData = new FormData();
      formData.set('position', position);
      try {
        fetch(`${listModule.list_base_url}/${listId}`, {
          method: 'PATCH',
          body: formData
        });
      } catch (error) {
        alert(listModule.defaultErrorMessage);
        console.error(error);
      }
    });

  },


  makeListInDOM: function (listName, listId) {
    const listTemplate = document.getElementById('template-list');
    const listTemplateContent = listTemplate.content;
    const newList = document.importNode(listTemplateContent, true);
    const newListTitle = newList.querySelector('h2');
    newListTitle.textContent = listName;

    newListTitle.addEventListener('dblclick', listModule.handleListTitleEdit);

    const form = newListTitle.nextElementSibling;
    form.addEventListener('submit', listModule.handleEditListForm);

    if (listId) {
      const blockList = newList.querySelector('.panel');
      blockList.setAttribute('list-id', listId);
      const idField = form.querySelector('input[name="id"]');
      idField.value = listId;
      const nameField = form.querySelector('input[name="name"]');
      nameField.value = listName;
    }

    const listContainer = document.querySelector('.card-lists');
    const button = newList.querySelector('.add-card-button');

    listContainer.append(newList);

    button.addEventListener('click', cardModule.showAddCardModal);
  },

  handleAddListForm: async function (event) {
    try {
      const formData = new FormData(event.target);

      const response = await fetch(listModule.list_base_url, {
        method: 'POST',
        body: formData
      });

      const newListOrError = await response.json();

      if (response.status !== 200) {
        throw newListOrError;
      }

      listModule.makeListInDOM(newListOrError.name, newListOrError.id);
    } catch (error) {
      alert(listModule.defaultErrorMessage);
      console.error(error);
    }
  },

  handleListTitleEdit: function (event) {
    const currentTitle = event.target;
    currentTitle.classList.add('is-hidden');
    const form = currentTitle.nextElementSibling;
    form.classList.remove('is-hidden');
  },

  handleEditListForm: async function (event) {
    try {
      event.preventDefault();

      const formData = new FormData(event.target);

      const response = await fetch(`${listModule.list_base_url}/${formData.get('id')}`, {
        method: 'PATCH',
        body: formData
      });

      const newListOrError = await response.json();

      if (response.status !== 200) {
        throw newListOrError;
      }
      const currentList = event.target.closest('.panel');

      const currentTitle = currentList.querySelector('h2');
      currentTitle.textContent = newListOrError.name;
      currentTitle.classList.remove('is-hidden');
      const form = currentTitle.nextElementSibling;
      form.classList.add('is-hidden');

    } catch (error) {
      alert(listModule.defaultErrorMessage);
      console.error(error);
    }
  }

};

module.exports = listModule;
},{"./card":2}],4:[function(require,module,exports){
const tagModule = {

    defaultErrorMessage: 'Désolé un problème est survenu avec les tags, veuillez réessayer ultérieurement',

    setBaseUrl: function (base_url) {
        tagModule.tag_base_url = base_url + '/tags'
    },

    showEditTagsModal: function () {
        const editTagsModal = document.getElementById('addAndEditTagModal');
        editTagsModal.classList.add('is-active');
    },

    handleAddTagForm: async function (event) {

        const myFormFromDOM = event.target;

        const formData = new FormData(myFormFromDOM);

        try {

            const response = await fetch(
                tagModule.tag_base_url,
                {
                    method: 'POST',
                    body: formData,

                }
            );

            const tagOrError = await response.json();

            if (response.status !== 200) {
                throw tagOrError;
            }

            tagModule.makeTagInDom(tagOrError);
        } catch (error) {
            alert(cardModule.defaultErrorMessage);
            console.error(error);
        }
    },

    getTagsFromAPI: async function () {
        try {

            const response = await fetch(tagModule.tag_base_url);

            if (response.status !== 200) {
                const error = await response.json();
                throw error;
            }

            const tags = await response.json();
            for (const tag of tags) {
                tagModule.makeTagInDom(tag);
            }

        } catch (error) {
            alert(cardModule.defaultErrorMessage);
            console.error(error);
        }
    },

    makeTagInDom: function (tag) {
        const tagTemplate = document.getElementById('template-tag');
        const tagTemplateContent = tagTemplate.content;
        const newTag = document.importNode(tagTemplateContent, true);

        const tagSpan = newTag.querySelector('.tag');

        tagSpan.textContent = tag.name.toLowerCase();
        tagSpan.style.backgroundColor = tag.color;

        const tagContainer = document.querySelector('.tags');
        tagContainer.append(newTag);
    }
};

module.exports = tagModule;
},{}]},{},[1]);
