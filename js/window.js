document.body.style.resize = 'none';

window.addEventListener('focus',function(){
    isTabActive = true;
});
window.addEventListener('blur',function(){
    isTabActive = false;
});
window.addEventListener('resize',function(){
    ClearContainer();
});