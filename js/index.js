function status(event, name) {
   let project_content = $('.project_content');
   for (let i = 0; i < project_content.length; i++) {
      project_content[i].style.display = 'none';
   }
   let btn = $('.btn');
   for (let i = 0; i < btn.length; i++) {
      btn[i].className = btn[i].className.replace('active', '');
   }
   document.getElementById(name).style.display = 'block';
   event.currentTarget.className += ' active';
}
document.getElementById("defaultOpen").click();

let link = $('.link');
for (let j = 0; j < link.length; j++) {
   link[j].addEventListener('click', function () {
      for (let i = 0; i < link.length; i++) {
         link[i].classList.remove('active');
      }
      this.classList.add('active');
   });
};
$(document).ready(function () {
   $('.menu_toggle').click(function () {
      $('.navbar').toggleClass('active');
   })
   $(function () {
      $('.chart').easyPieChart({
         barColor: '#17d3e6',
         scaleColor: false,
         lineWidth: 10,
         trackColor: '#333333'
      });
   });
})