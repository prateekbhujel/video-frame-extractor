$(document).ready(function() {
  let frames = [];
  let allSelected = false;

  // Event Listeners
  $('#videoUpload').on('change', handleVideoUpload);
  $('#toggleSelect').on('click', toggleSelectAll);
  $('#downloadSelected').on('click', () => processDownload('selected'));
  $('#downloadAll').on('click', () => processDownload('all'));
  $('#toggleTheme').on('click', toggleTheme);

  function handleVideoUpload(e) {
    if ($('#loading').is(':visible')) {
      if (!confirm('Processing is still ongoing. Uploading a new video will flush the current data. Do you want to continue?')) {
        return;
      }
    }
    const file = e.target.files[0];
    if (file) {
      const video = document.createElement('video');
      video.src = URL.createObjectURL(file);
      video.onloadeddata = function() {
        extractFrames(video);
      }
    }
  }

  function extractFrames(video) {
    const canvas = document.createElement('canvas');
    const ctx = canvas.getContext('2d');
    const interval = 1; // seconds
    const duration = Math.floor(video.duration);
    
    $('#frames').empty();
    frames = [];
    $('#loading').show();
    disableControls(true);

    for (let i = 0; i < duration; i += interval) {
      setTimeout(() => {
        canvas.width = video.videoWidth;
        canvas.height = video.videoHeight;
        video.currentTime = i;
        ctx.drawImage(video, 0, 0, canvas.width, canvas.height);
        const img = new Image();
        img.src = canvas.toDataURL();
        addFrameToUI(img.src, i);
        frames.push(img.src);
        if (i >= duration - interval) {
          $('#loading').hide();
          disableControls(false);
        }
      }, i * 1000);
    }
  }

  function addFrameToUI(imgSrc, index) {
    const frameItem = $(`
      <div class="frame-item">
        <img src="${imgSrc}" alt="Frame ${index + 1}">
        <div class="frame-actions">
          <input type="checkbox" class="frame-checkbox">
          <button class="frame-download btn"><i class="fas fa-download"></i> Download</button>
        </div>
      </div>
    `);

    frameItem.find('.frame-download').on('click', function() {
      downloadSingleFrame($(this), imgSrc, index);
    });

    $('#frames').append(frameItem);
  }

  function downloadSingleFrame(button, frameUrl, index) {
    const originalText = button.html();
    button.html('<i class="fas fa-spinner fa-spin"></i> Downloading...');
    button.prop('disabled', true);

    setTimeout(() => {
      const a = document.createElement('a');
      a.href = frameUrl;
      a.download = `frame${index + 1}.png`;
      document.body.appendChild(a);
      a.click();
      document.body.removeChild(a);

      button.html(originalText);
      button.prop('disabled', false);
    }, 1000);
  }

  function disableControls(disable) {
    $('#toggleSelect, #downloadSelected, #downloadAll, #videoUpload').prop('disabled', disable);
  }

  function toggleSelectAll() {
    allSelected = !allSelected;
    $('.frame-checkbox').prop('checked', allSelected);
  }

  function processDownload(type) {
    disableControls(true);
    updateDownloadButtonText('Processing...');

    setTimeout(() => {
      let frameArray = type === 'selected' ? getSelectedFrames() : frames;
      downloadFrames(frameArray);
      updateDownloadButtonText('Download');
      disableControls(false);
    }, 500);
  }

  function getSelectedFrames() {
    return $('.frame-checkbox:checked').map(function() {
      return $(this).closest('.frame-item').find('img').attr('src');
    }).get();
  }

  function updateDownloadButtonText(text) {
    $('#downloadSelected').text(`${text} Selected`);
    $('#downloadAll').text(`${text} All as Zip`);
  }

  function downloadFrames(frameArray) {
    const zip = new JSZip();
    frameArray.forEach((frame, index) => {
      zip.file(`frame${index + 1}.png`, frame.split(',')[1], { base64: true });
    });
    zip.generateAsync({ type: 'blob' }).then(content => {
      saveAs(content, 'frames.zip');
    });
  }

  function toggleTheme() {
    $('body').toggleClass('dark-mode');
    const icon = $('body').hasClass('dark-mode') ? 'fas fa-moon' : 'fas fa-sun';
    $(this).html(`<i class="${icon}"></i>`);
  }
});