document.addEventListener('DOMContentLoaded', () => {
    const title = document.querySelector('.title');
    const bullet = document.querySelector('.bullet');
        
    bullet.addEventListener('animationstart', () => {
        gunshotSound.play();
    });

});
