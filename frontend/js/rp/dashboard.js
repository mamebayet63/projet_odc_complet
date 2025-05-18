import { countActiveEntities } from '../utils/utils.js';

countActiveEntities("students").then(count => {
    document.getElementById("student-count").textContent = `${count}`;
});

countActiveEntities("prof").then(count => {
    document.getElementById("prof-conts").textContent = `${count}`;
});
countActiveEntities("classes").then(count => {
    document.getElementById("classe-count").textContent = `${count}`;
});