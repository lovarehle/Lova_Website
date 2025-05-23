// Add viewport height fix function
function updateViewportHeight() {
    // Set a CSS variable with the actual viewport height
    const vh = window.innerHeight * 0.01;
    document.documentElement.style.setProperty('--vh', `${vh}px`);
}

const mediaItemsRaw = [
    { url: 'images/Collective_Vitra_some_2.mp4', caption: 'Collective Bakery × Vitra – Visual Identity, Socials. Team: Ludvig Weingarten & Ramiro Oblitas' },
    { url: 'images/CBxVitra_postcards.jpg', caption: 'Collective Bakery × Vitra – Visual Identity, Postcards. Zürich. Team: Ludvig Weingarten & Ramiro Oblitas'},
    { url: 'images/CBxVitra_vinyls.jpg', caption: 'Collective Bakery × Vitra – Visual Identity, Window Foil. Zürich. Team: Ludvig Weingarten & Ramiro Oblitas' },
    { url: 'images/CBxVitra_Totebag.jpg', caption: 'Collective Bakery × Vitra – Visual Identity, Totebag. Zürich. Team: Ludvig Weingarten & Ramiro Oblitas', fullViewport: true },
    { url: 'images/SG_logo.mp4', caption: 'Specific Generic – SG Display, Typeface. Team: Ludvig Weingarten & Ramiro Oblitas' },
    { url: 'images/SG_display.gif', caption: 'Specific Generic – SG Display, Typeface. Team: Ludvig Weingarten & Ramiro Oblitas' },
    { url: 'images/OptiLife_prospect.gif', caption: 'OptiLife – Graduating Project, Pamphlet.' },
    {
        url: '<iframe src="https://player.vimeo.com/video/1071040688?badge=0&amp;autopause=0&amp;player_id=0&amp;app_id=58479" frameborder="0" allow="autoplay; fullscreen; picture-in-picture; clipboard-write; encrypted-media" style="width:100%;height:100%;object-fit:contain;" title="OptiLife"></iframe><script src="https://player.vimeo.com/api/player.js"></script>',
        caption: 'OptiLife – Graduating Project, Ad.',
        hideOnMobile: true,
        isVimeo: true // Mark this item specifically as Vimeo
    },
    { url: 'images/om_bofaf_video_3.mp4', caption: 'OnceMore – Book of Forests & Fabrics. Team: Ludvig Weingarten & Ramiro Oblitas' },
    { url: 'images/OM_4.jpg', caption: 'OnceMore – Giveaway. Team: Ludvig Weingarten & Ramiro Oblitas' },
    { url: 'images/Fjäder_.jpg', caption: 'OnceMore – Sales Tool. Team: Ludvig Weingarten & Ramiro Oblitas'},
    { url: 'images/SGxKB-entrence.jpg', caption: 'OnceMore – Event Design. Konstnärshuset, Stockholm. Team: Ramiro Oblitas', fullViewport: true},
    { url: 'images/SGxKB-9692-2.jpg', caption: 'OnceMore – Event Design. Konstnärshuset, Stockholm. Team: Ramiro Oblitas', fullViewport: true},
    { url: 'images/bag_roots.jpg', caption: 'Roots – Visual Identity, Takeaway Bag. Zürich. Team: Ludvig Weingarten & Ramiro Oblitas' },
    { url: 'images/Menuboard_roots.jpg', caption: 'Roots – Visual Identity, Menu Boards. Zürich. Team: Ramiro Oblitas' },
    { url: 'images/roots_signage.jpg', caption: 'Roots – Visual Identity, Signage. Zürich. Team: Ludvig Weingarten & Ramiro Oblitas'},
    { url: 'images/Roots_website.mp4', caption: 'Roots – Visual Identity, Website. Zürich. Team: Ludvig Weingarten & Ramiro Oblitas' },
    { url: 'images/Rondo_scan_lowres.jpg', caption: 'Rondo – Broadsheet Magazine Design, #1. Team: Ida Gustafsson, Anna Ericsson Hybbinette & Wasim Harwill' },
    { url: 'images/DSC08326_lowres.jpg', caption: 'Rondo – Broadsheet Magazine Design, #2. Team: Ida Gustafsson, Anna Ericsson Hybbinette & Wasim Harwill'},
    { url: 'images/Rondo_frilagd.jpg', caption: 'Rondo – Broadsheet Magazine Design, #3. Team: Ida Gustafsson, Anna Ericsson Hybbinette & Wasim Harwill' },
    { url: 'images/WoE_Story.mp4', caption: 'Works of Essence – Visual Identity, Socials. Team: Eliot Siekkinen Lydéen' },
    { url: 'images/WoE_podium.jpg', caption: 'Works of Essence – Visual Identity, Podium. Team: Eliot Siekkinen Lydéen' },
    { url: 'images/WoE_posters_.jpg', caption: 'Works of Essence – Visual Identity, Posters. Team: Eliot Siekkinen Lydéen', fullViewport: true  },

];

// Function to make videos behave like GIFs
function setupVideoAsGif(video) {
    video.autoplay = true;
    video.muted = true;
    video.loop = true;
    video.playsInline = true;
    video.preload = 'auto';

    // Disable fullscreen, download, and other controls
    video.setAttribute('disablePictureInPicture', '');
    video.setAttribute('controlslist', 'nodownload nofullscreen noremote');
    video.removeAttribute('controls');  // Ensure no native controls

    // Disable pointer interaction, so it behaves like a gif
    video.style.pointerEvents = 'none';
    video.style.touchAction = 'none';
    video.style.webkitUserSelect = 'none';
    video.style.userSelect = 'none';
}

// Determine if the user is on a mobile device (screen width <= 730px)
const isMobile = window.innerWidth <= 730;

// Filter out items marked with hideOnMobile on mobile
const mediaItems = isMobile
    ? mediaItemsRaw.filter(item => !item.hideOnMobile)
    : mediaItemsRaw;

let currentMediaIndex = Math.floor(Math.random() * mediaItems.length)
const captionElement = document.querySelector('.caption');
const infoOverlay = document.querySelector('.info-overlay');
const infoButton = document.querySelector('.info');
const counterElement = document.querySelector('.counter');
const captionOverlay = document.querySelector('.caption-overlay');
const container = document.querySelector('.container');
const mediaContainer = document.querySelector('.media-container');
const headerTextElement = document.querySelector('.header-text');

const preloadedMedia = [];
let elementsToReveal;
const flashInterval = 200;

function getMediaType(url) {
    if (typeof url === 'string') {
        const extension = url.split('.').pop().toLowerCase();
        if (['jpg', 'jpeg', 'png', 'gif'].includes(extension)) {
            return 'image';
        } else if (['mp4', 'webm', 'ogg'].includes(extension)) {
            return 'video';
        } else if (url.includes('vimeo.com/video') || url.includes('player.vimeo.com/video')) {
            return 'vimeo';
        }
    }
    return 'unknown';
}

async function preloadMedia() {
    return new Promise((resolve) => {
        let loadedCount = 0;
        const totalMedia = mediaItems.length;

        const placeholderImage = new Image();
        placeholderImage.src = 'data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAAEAAAABCAQAAAC1HAwCAAAAC0lEQVR42mNkYAAAAAYAAjCB0C8AAAAASUVORK5CYII=';

        mediaItems.forEach((item, index) => {
            const mediaType = getMediaType(item.url);
            if (mediaType === 'image') {
                const img = new Image();
                img.onload = () => {
                    preloadedMedia[index] = img;
                    loadedCount++;
                    if (loadedCount === totalMedia) resolve();
                };
                img.onerror = () => {
                    console.error(`Failed to load image: ${item.url}`);
                    preloadedMedia[index] = placeholderImage;
                    loadedCount++;
                    if (loadedCount === totalMedia) resolve();
                };
                img.src = item.url;
            } else if (mediaType === 'video') {
                preloadedMedia[index] = { type: 'video', url: item.url };
                loadedCount++;
                if (loadedCount === totalMedia) resolve();
            } else if (mediaType === 'vimeo') {
                preloadedMedia[index] = { type: 'vimeo', url: item.url };
                loadedCount++;
                if (loadedCount === totalMedia) resolve();
            } else {
                console.error(`Unknown media type: ${item.url}`);
                preloadedMedia[index] = placeholderImage;
                loadedCount++;
                if (loadedCount === totalMedia) resolve();
            }
        });

        setTimeout(() => {
            if (loadedCount < totalMedia) {
                console.warn(`Only ${loadedCount} of ${totalMedia} media loaded after timeout.`);
                resolve();
            }
        }, 10000);
    });
}

function enforceFontSizes() {
    const fontSize = window.innerWidth < 730 ? '20px' : '25px';
    [counterElement, captionElement, infoButton, document.querySelector('.info-text'), headerTextElement].forEach(element => {
        if (element) {
            if (element.length) {
                element.forEach(el => el.style.fontSize = fontSize);
            } else {
                element.style.fontSize = fontSize;
            }
        }
    });
}

function flashMedia() {
    // Filter out only image items (no videos or vimeo)
    const imageItems = mediaItems.filter(item => getMediaType(item.url) === 'image');

    // Get 6 random images without duplicates
    let flashImages = [];
    const tempImages = [...imageItems]; // Create a copy to avoid modifying the original array

    // Select 6 random images or as many as available if less than 6
    const numToSelect = Math.min(6, tempImages.length);

    for (let i = 0; i < numToSelect; i++) {
        const randomIndex = Math.floor(Math.random() * tempImages.length);
        flashImages.push(tempImages[randomIndex]);
        tempImages.splice(randomIndex, 1); // Remove selected item to avoid duplicates
    }

    let currentFlashIndex = 0;

    function flashNextMedia() {
        if (currentFlashIndex < flashImages.length) {
            mediaContainer.innerHTML = '';
            const item = flashImages[currentFlashIndex];
            const originalIndex = mediaItems.findIndex(mediaItem => mediaItem.url === item.url);
            let flashElement;

            if (originalIndex !== -1 && preloadedMedia[originalIndex]) {
                flashElement = document.createElement('img');
                flashElement.src = preloadedMedia[originalIndex].src || item.url;
                flashElement.classList.add('slideshow-image');
                mediaContainer.appendChild(flashElement);
            }

            currentFlashIndex++;
            setTimeout(flashNextMedia, flashInterval);
        } else {
            updateMedia();
            revealElements();
            updateCounter();
            enforceFontSizes();
        }
    }

    flashNextMedia();
}

function revealElements() {
    elementsToReveal.forEach(element => {
        element.classList.remove('hidden');
        element.style.opacity = 1;
    });
}

function updateMedia() {
    mediaContainer.innerHTML = '';
    const item = mediaItems[currentMediaIndex];
    const mediaType = getMediaType(item.url);
    let mediaElement;

    if (mediaType === 'image') {
        mediaElement = document.createElement('img');
        mediaElement.src = preloadedMedia[currentMediaIndex].src || item.url;
        mediaElement.classList.add('slideshow-image');
        
        // Add fullViewport class if specified
        if (item.fullViewport) {
            mediaElement.classList.add('full-viewport');
        }
    } else if (mediaType === 'video') {
        mediaElement = document.createElement('video');
        mediaElement.dataset.src = item.url;
        mediaElement.classList.add('slideshow-video');
        
        // Add fullViewport class if specified
        if (item.fullViewport) {
            mediaElement.classList.add('full-viewport');
        }
        
        // Apply GIF-like settings to the video
        if (!item.isVimeo) {
            setupVideoAsGif(mediaElement);
        }
        mediaElement.onerror = (error) => {
            console.error('Video loading error:', error);
            const placeholder = document.createElement('img');
            placeholder.src = 'placeholder.jpg';
            mediaContainer.appendChild(placeholder);
        };
    } else if (mediaType === 'vimeo') {
        mediaElement = document.createElement('div');
        mediaElement.dataset.src = item.url;
        mediaElement.classList.add('slideshow-video');
        // Add class to identify it as Vimeo content
        mediaElement.classList.add('vimeo-embed');
        
        // Add fullViewport class if specified
        if (item.fullViewport) {
            mediaElement.classList.add('full-viewport');
        }
    }

    if (mediaElement) {
        mediaContainer.appendChild(mediaElement);
    }

    // Display full caption without truncation or ellipsis
    captionElement.innerHTML = item.caption.replace(/\n/g, '<br>');

    // Apply lazy loading
    if (mediaType === 'video' || mediaType === 'vimeo') {
        observeMedia(mediaElement, mediaType, item.isVimeo);
    }

    // Handle hide-on-mobile class
    if (item.hideOnMobile && window.innerWidth <= 730) {
        mediaElement.classList.add('hide-on-mobile');
    } else {
        mediaElement.classList.remove('hide-on-mobile');
    }
}

function observeMedia(element, mediaType, isVimeo) {
    const observer = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                if (mediaType === 'video') {
                    element.src = element.dataset.src;
                    element.removeAttribute('data-src');
                    // Re-apply GIF-like settings after source is set
                    if (!isVimeo) {
                        setupVideoAsGif(element);
                    }
                    // Try to play the video immediately
                    const playPromise = element.play();
                    if (playPromise !== undefined) {
                        playPromise.catch(error => {
                            console.error('Auto-play error:', error);
                            // On error, try once more with user interaction
                            document.addEventListener('touchstart', function playOnTouch() {
                                element.play();
                                document.removeEventListener('touchstart', playOnTouch);
                            }, { once: true });
                        });
                    }
                } else if (mediaType === 'vimeo') {
                    // Set the HTML content (which contains the iframe)
                    element.innerHTML = element.dataset.src;
                    element.removeAttribute('data-src');
                    
                    // Find and properly style the Vimeo iframe
                    const vimeoIframe = element.querySelector('iframe');
                    if (vimeoIframe) {
                        // Apply the vimeo-iframe class for styling
                        vimeoIframe.classList.add('vimeo-iframe');
                        
                        // Check if parent has fullViewport class
                        if (element.classList.contains('full-viewport')) {
                            vimeoIframe.classList.add('full-viewport');
                            vimeoIframe.style.width = '100%';
                            vimeoIframe.style.height = '100%';
                            vimeoIframe.style.maxWidth = '100%';
                            vimeoIframe.style.maxHeight = '100%';
                        } else {
                            // Make sure Vimeo iframe maintains consistent sizing
                            const sizePercent = window.innerWidth < 730 ? '95%' : '80%';
                            vimeoIframe.style.width = sizePercent;
                            vimeoIframe.style.height = '80%';
                            vimeoIframe.style.maxWidth = sizePercent;
                            vimeoIframe.style.maxHeight = '80%';
                        }
                        
                        // Ensure it's interactive
                        vimeoIframe.style.pointerEvents = 'auto';
                        vimeoIframe.style.touchAction = 'auto';
                    }
                }
                observer.unobserve(element);
            }
        });
    }, {
        root: null,
        rootMargin: '0px',
        threshold: 0.1
    });

    observer.observe(element);
}

function nextMedia() {
    currentMediaIndex = (currentMediaIndex + 1) % mediaItems.length;
    updateMedia();
    updateCounter();
}

function previousMedia() {
    currentMediaIndex = (currentMediaIndex - 1 + mediaItems.length) % mediaItems.length;
    updateMedia();
    updateCounter();
}

function updateCounter() {
    counterElement.textContent = `${currentMediaIndex + 1} / ${mediaItems.length}`;
}

document.addEventListener('DOMContentLoaded', async () => {
    // Initialize viewport height calculation
    updateViewportHeight();
    
    elementsToReveal = [counterElement, captionElement, infoButton];
    elementsToReveal.forEach(element => {
        element.classList.add('hidden');
        element.style.opacity = 0;
    });

    await preloadMedia();
    flashMedia();

    setupCursorChange();
    enforceFontSizes();
    
    // Add event listeners for viewport adjustments
    window.addEventListener('resize', updateViewportHeight);
    window.addEventListener('orientationchange', updateViewportHeight);
    
    // For iOS Safari, we need to handle scroll events too
    window.addEventListener('scroll', () => {
        // Small delay to ensure accurate height after scroll completes
        setTimeout(updateViewportHeight, 100);
    });
    
    window.addEventListener('resize', enforceFontSizes);

    // Apply GIF-like behavior to regular videos on the page, but not Vimeo embeds
    document.querySelectorAll('video:not(.vimeo-video)').forEach(setupVideoAsGif);

    // Add event listener for left and right arrow keys
    document.addEventListener('keydown', function(event) {
        if (event.key === 'ArrowLeft') {
            previousMedia();
        } else if (event.key === 'ArrowRight') {
            nextMedia();
        }
    });

    window.addEventListener('resize', () => {
        enforceFontSizes();
        updateMedia();
    });
    
    // Special handler for iOS to ensure videos play correctly (but not Vimeo)
    if (/iPhone|iPad|iPod|iOS/i.test(navigator.userAgent)) {
        document.addEventListener('touchstart', function initialTouch() {
            const videos = document.querySelectorAll('video:not(.vimeo-video)');
            videos.forEach(video => {
                if (video.paused) {
                    const playPromise = video.play();
                    if (playPromise !== undefined) {
                        playPromise.catch(e => console.log('Play prevented:', e));
                    }
                }
            });
            document.removeEventListener('touchstart', initialTouch);
        }, { once: true });
    }
});

function setupCursorChange() {
    document.addEventListener('mousemove', event => {
        // Check if mouse is over the info button or if any overlay is active
        const isOverInfo = event.target === infoButton;
        const isOverlayActive = infoOverlay.style.display === 'flex';
        const isOverVimeo = event.target.classList && (
            event.target.classList.contains('vimeo-iframe') || 
            event.target.closest('.vimeo-embed')
        );
        
        // Set cursor to pointer when over interactive elements
        if (isOverInfo || isOverlayActive || isOverVimeo) {
            container.style.cursor = 'pointer';
        } else {
            // Otherwise set cursor based on position (for next/previous)
            container.style.cursor = event.clientX > window.innerWidth / 2 ? 'e-resize' : 'w-resize';
        }
    });
}

document.addEventListener('click', event => {
    // Check if clicking on Vimeo content
    const isVimeoClick = event.target.classList && (
        event.target.classList.contains('vimeo-iframe') || 
        event.target.closest('.vimeo-embed')
    );
    
    if (event.target === infoButton) {
        infoOverlay.style.display = infoOverlay.style.display === 'flex' ? 'none' : 'flex';
        infoButton.textContent = infoOverlay.style.display === 'flex' ? '(Close)' : '(Info)';
        enforceFontSizes();
    } else if (isVimeoClick) {
        // Do nothing if clicking on Vimeo content to allow interaction
        event.stopPropagation();
    } else {
        // For clicks elsewhere, just navigate to next/previous image
        event.clientX > window.innerWidth / 2 ? nextMedia() : previousMedia();
    }
});