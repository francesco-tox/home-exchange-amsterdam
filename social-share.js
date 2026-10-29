(() => {
 const bar = document.querySelector('[data-social-share]');
 const dialog = document.getElementById('socialStory');
 if (!bar || !dialog || typeof dialog.showModal !== 'function') return;
 const url = document.querySelector('link[rel="canonical"]')?.href || 'https://aquietamsterdamhome.com/';
 const feedback = bar.querySelector('[data-share-status]');
 const storyFeedback = dialog.querySelector('[data-story-status]');
 const storyLink = dialog.querySelector('[data-story-link]');
 const fallback = bar.querySelector('[data-copy-fallback]');
 const fallbackInput = fallback.querySelector('input');
 const save = dialog.querySelector('[data-story-save]');
 const shareImage = dialog.querySelector('[data-story-share]');
 const preview = dialog.querySelector('[data-story-preview]');
 const shareUrl = new URL(url);
 shareUrl.searchParams.set('share', '20261029-v2');
 const freshLink = shareUrl.href;
 let imageFile = null, loading = false;
 bar.querySelector('[data-share-facebook]').href = 'https://www.facebook.com/sharer/sharer.php?u=' + encodeURIComponent(freshLink);
 bar.querySelector('[data-share-whatsapp]').href = 'https://wa.me/?text=' + encodeURIComponent(freshLink);
 storyLink.value = url;
 fallbackInput.value = url;
 bar.querySelectorAll('button[hidden]').forEach(button => { button.hidden = false; });
 function announce(element, message) { element.textContent = message; }
 async function copyLink(inStory = false) {
  const output = inStory ? storyFeedback : feedback;
  try {
   if (!navigator.clipboard?.writeText) throw new Error('Clipboard unavailable');
   await navigator.clipboard.writeText(url);
   fallback.hidden = true;
   announce(output, inStory ? 'Link copied. Paste it into a Link sticker in Instagram.' : 'Link copied.');
  } catch {
   const input = inStory ? storyLink : fallbackInput;
   if (!inStory) fallback.hidden = false;
   input.focus(); input.select();
   announce(output, 'Select and copy the link shown above.');
  }
 }
 async function prepareFile() {
  if (imageFile || loading || !navigator.share || !navigator.canShare) return;
  loading = true;
  try {
   const response = await fetch(save.href);
   if (!response.ok) throw new Error('Image unavailable');
   imageFile = new File([await response.blob()], 'a-quiet-amsterdam-home-story-v2.jpg', {type:'image/jpeg'});
   if (navigator.canShare({files:[imageFile]})) shareImage.hidden = false;
  } catch {
   // Saving the image and copying the link remain available.
  } finally { loading = false; }
 }
 bar.querySelector('[data-story-open]').addEventListener('click', () => {
  if (!preview.getAttribute('src')) preview.src = save.href;
  storyFeedback.textContent = '';
  dialog.showModal();
  prepareFile();
 });
 bar.querySelector('[data-copy-link]').addEventListener('click', () => copyLink());
 dialog.querySelector('[data-story-copy]').addEventListener('click', () => copyLink(true));
 dialog.querySelector('[data-story-close]').addEventListener('click', () => dialog.close());
 dialog.addEventListener('click', event => { if (event.target === dialog) {
  const rect = dialog.getBoundingClientRect();
  if (event.clientX < rect.left || event.clientX > rect.right || event.clientY < rect.top || event.clientY > rect.bottom) dialog.close();
 }});
 shareImage.addEventListener('click', async () => {
  if (!imageFile) return;
  try {
   // File is ready before this click, preserving the browser's user activation.
   await navigator.share({files:[imageFile]});
   announce(storyFeedback, 'Add a Link sticker in Instagram using the page link below.');
  } catch (error) {
   if (error.name !== 'AbortError') announce(storyFeedback, 'Save the image, then open it in an Instagram story.');
  }
 });
})();
