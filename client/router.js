'use strict';

const route = (event) => {
    event = event || window.event;
    event.preventDefault();
    // history API , pushState(앞, 뒤로 가기)
    window.history.pushState({}, '', event.target.href);
    handleLocation();
};

const routes = {
    '/': '/index.html',
    '/user/chat': '/chat.html',
};

const handleLocation = async () => {
    const path = window.location.pathname;
    const route = routes[path] || routes[404]; // path 경로에 있거나 없는 경우 404페이지를 라우트 구조로 전달
    console.log(route);

    // 경로에 대한 html 로드
    const html = await fetch(route).then((data) => data.text());
    document.getElementById('main-page').innerHTML = html;
};

window.onpopstate = handleLocation;
window.route = route;
