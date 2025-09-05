const list = document.querySelector(".block-list ");
const editBlock = document.querySelector(".edit");
const exitBtn = document.querySelector(".exit-btn");
const editBtn = document.querySelector(".edit-btn");
const orderInput = document.querySelector(".order-input");
const descriptionInput = document.querySelector(".description-input");

const deleteBlock = document.querySelector(".delete");
const orderDeleteText = document.querySelector(".order-delete");
const descriptionDeleteText = document.querySelector(".description-delete");
const deleteExitBtn = document.querySelectorAll(".delete-exit-btn");
const deleteBtn = document.querySelector(".delete-btn");

let arrayData;
let id;

async function getData() {
  const url = "http://localhost:4000/orders/";
  try {
    const response = await fetch(`${url}`);
    const data = await response.json();
    if (data) arrayData = data;
    render();
    const btnList = document.querySelectorAll(".btn-edit");
    const btnDelete = document.querySelectorAll(".btn-delete");
    if (btnList) edit(btnList, btnDelete);
  } catch (error) {
    console.log(error, "Ошибка");
  }
}
getData();

async function putEdit(arrayData, id, title, description) {
  const url = "http://localhost:4000/orders/";
  const obj = arrayData.find((e) => e.id === id);
  const newObj = { ...obj, title: title, description: description };

  try {
    await fetch(`${url}${id}`, {
      method: 'PUT',
      body: JSON.stringify(newObj),
      headers: {
        "Content-Type": 'application/json; charset="UTF-8"', // формат отправки json
      },
    });
  } catch (error) {
    console.log(error, "Ошибка");
  }
}

async function deleteOrder(id) {
  const url = "http://localhost:4000/orders/";
  try {
    await fetch(`${url}${id}`, {method: 'DELETE'});
  } catch (error) {
    console.log(error, "Ошибка");
  }
}


function edit(btnList, btnDelete) {
  // Общая функция для обработки клика
  function createHandler(text, displayBlock) {
    return (e) => {
      const parent = e.target.parentElement.parentElement.parentElement;
      id = parent.id;

      if (text === "Edit") {
        orderInput.value = parent.querySelector(".order-title").textContent;
        descriptionInput.value = parent.querySelector(".description").textContent;
      } else if (text === "Delete") {
        orderDeleteText.textContent = parent.querySelector(".order-title").textContent;
        descriptionDeleteText.textContent = parent.querySelector(".description").textContent;
      }

      displayBlock.style.display = "flex";
    };
  }

  const editHandler = createHandler((text = "Edit"), editBlock);
  const deleteHandler = createHandler((text = "Delete"), deleteBlock);


  btnList.forEach((btn) => btn.addEventListener("click", editHandler));
  btnDelete.forEach((btn) => btn.addEventListener("click", deleteHandler));
}

exitBtn.addEventListener("click", () => (editBlock.style.display = "none")); // Закрыть мод окно exit
editBtn.addEventListener("click", () => {
  // Редактировать заказ
  const title = orderInput.value;
  const description = descriptionInput.value;
  if (arrayData && id && title && description) {
    putEdit(arrayData, id, title, description);
  }
});

deleteExitBtn.forEach((element) => {
  element.addEventListener("click", () => (deleteBlock.style.display = "none"));
}); // Закрыть мод окно delet
deleteBtn.addEventListener("click", () => deleteOrder(id));

function render() {
  arrayData.forEach((element) => {
    const item = document.createElement("div");
    item.className = `items`;
    item.id = element.id;
    item.innerHTML = `
        <div class="customer">
          <h1 class="order">Заказ</h1>
          <div class='order-description'>
            <h1 class="order-title"> ${element.title}</h1>
            <div>
              <p>Описание: </p>
              <p class="description">${element.description}</p>
            </div>
            <span class="customerName">Заказчик: ${element.customerName}</span>
            <span class="reward">Награда: ${element.reward} монет</span>
            <span class="status">Статус: ${element.status}</span>
            <span class="deadline">Крайний срок: ${element.deadline}</span>
            <span class="createdAt">Опубликованно: ${element.createdAt}</span>
          </div>
          <div>
            <button class='btn-delete'>Удалить</button>
            <button class='btn-edit'>Редактировать</button>
          </div>
        </div>
        <div class="assignee">
          <h1 class="name">${element.assignee.name}</h1>
          <img class="avatar" src="${element.assignee.avatar}" alt="avatar">
        </div>
      `;
    list.appendChild(item);
  });
}
