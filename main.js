import { Application } from '@splinetool/runtime';
import { initLobby } from './lobby.js';
import { initPortfolio } from './portfolio.js';
import { disableSplineWatermark, hideSplineSceneLogos } from './spline-branding.js';

document.addEventListener('DOMContentLoaded', () => {
    const loadingEl = document.getElementById('loading');
    const cursor = document.getElementById('cursor');
    const follower = document.getElementById('cursor-follower');
    const canvas = document.getElementById('spline-canvas');
    const appEl = document.getElementById('app');
    const scrollContainer = document.getElementById('bureau-scroll');

    let mouseX = 0, mouseY = 0;
    let followerX = 0, followerY = 0;

    document.addEventListener('pointermove', (e) => {
        mouseX = e.clientX;
        mouseY = e.clientY;

        if (cursor) {
            cursor.style.left = `${mouseX}px`;
            cursor.style.top = `${mouseY}px`;
        }

        if (canvas && document.body.classList.contains('lobby-active')) {
            canvas.dispatchEvent(new PointerEvent('pointermove', {
                clientX: mouseX,
                clientY: mouseY,
                bubbles: true,
                cancelable: true,
                pointerType: 'mouse'
            }));
        }
    });

    const lobbyTitle = document.querySelector('.lobby-title');
    let titleX = 0, titleY = 0;

    const revealTitle = (el) => {
        if (!el) return;
        el.classList.add('is-revealed');
    };

    const animateFollower = () => {
        if (follower) {
            followerX += (mouseX - followerX) * 0.15;
            followerY += (mouseY - followerY) * 0.15;
            follower.style.left = `${followerX}px`;
            follower.style.top = `${followerY}px`;
        }

        if (lobbyTitle && document.body.classList.contains('lobby-active')) {
            const centerX = window.innerWidth / 2;
            const centerY = window.innerHeight / 2;
            const targetTitleX = (centerX - mouseX) * 0.04;
            const targetTitleY = (centerY - mouseY) * 0.04;
            titleX += (targetTitleX - titleX) * 0.1;
            titleY += (targetTitleY - titleY) * 0.1;
            lobbyTitle.style.setProperty('--tx', `${titleX}px`);
            lobbyTitle.style.setProperty('--ty', `${titleY}px`);
        }

        requestAnimationFrame(animateFollower);
    };
    animateFollower();

    const bindHover = () => {
        const interactiveElements = document.querySelectorAll(
            'a, button, .pipeline-stage, .nav-manifesto, .project-card, .pf-tab, .pf-item, .service-item, .lobby-portal, .brand-node, .branch-tab, .ba-range, select, input, textarea'
        );
        interactiveElements.forEach(el => {
            el.addEventListener('pointerenter', () => {
                if (follower) follower.classList.add('active');
                if (cursor) cursor.style.transform = 'translate(-50%, -50%) scale(0.5)';
            });
            el.addEventListener('pointerleave', () => {
                if (follower) follower.classList.remove('active');
                if (cursor) cursor.style.transform = 'translate(-50%, -50%) scale(1)';
            });
        });
    };
    bindHover();

    const hideLoading = () => {
        if (loadingEl) {
            loadingEl.classList.add('hidden');
            document.body.classList.add('spline-loaded');
        }
    };

    const lobby = initLobby({
        canvas,
        appEl,
        scrollContainer,
        onWingEnter: (wing) => {
            const typeSelect = document.getElementById('tg-type');
            if (typeSelect && !typeSelect.value) typeSelect.value = wing;
        }
    });

    let splineApp = null;

    if (canvas) {
        splineApp = new Application(canvas);
        splineApp.load('https://prod.spline.design/g3rHuIN4CEqqt0FJ/scene.splinecode')
            .then(() => {
                console.log('Bureau lobby Spline ready.');
                hideLoading();
                disableSplineWatermark(splineApp);
                hideSplineSceneLogos(splineApp);
                revealTitle(lobbyTitle);
                lobby.bindSplinePortals(splineApp);
            })
            .catch(err => {
                console.error('Spline Core Error:', err);
                hideLoading();
                disableSplineWatermark(splineApp);
                revealTitle(lobbyTitle);
            });
    } else {
        hideLoading();
    }

    const sections = document.querySelectorAll('.viewport-section');
    const observer = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) entry.target.classList.add('is-visible');
            else entry.target.classList.remove('is-visible');
        });
    }, { root: scrollContainer, threshold: 0.35 });

    sections.forEach(sec => observer.observe(sec));

    // Initialize portfolio gallery
    initPortfolio();

    // Before/after sliders (physical archive)
    document.querySelectorAll('.ba-slider').forEach(slider => {
        const range = slider.querySelector('.ba-range');
        const wrap = slider.querySelector('.ba-before-wrap');
        if (!range || !wrap) return;

        const update = () => {
            wrap.style.width = `${range.value}%`;
        };
        range.addEventListener('input', update);
        update();
    });

    // Pipeline branch tabs
    const branchTabs = document.querySelectorAll('.branch-tab');
    const pipelineSynthetic = document.getElementById('pipeline-synthetic');
    const pipelineHybrid = document.getElementById('pipeline-hybrid');
    const pipelinePhysical = document.getElementById('pipeline-physical');

    branchTabs.forEach(tab => {
        tab.addEventListener('click', () => {
            branchTabs.forEach(t => t.classList.remove('active'));
            tab.classList.add('active');
            const branch = tab.getAttribute('data-branch');
            pipelineSynthetic?.classList.toggle('wing-hidden', branch !== 'synthetic');
            pipelineHybrid?.classList.toggle('wing-hidden', branch !== 'hybrid');
            pipelinePhysical?.classList.toggle('wing-hidden', branch !== 'physical');
        });
    });

    // Pipeline stage cycling
    const btnPipeline = document.querySelector('.btn-pipeline');
    let currentStage = 0;

    const getActivePipelineStages = () => {
        let display = pipelineSynthetic;
        if (pipelinePhysical && !pipelinePhysical.classList.contains('wing-hidden')) {
            display = pipelinePhysical;
        } else if (pipelineHybrid && !pipelineHybrid.classList.contains('wing-hidden')) {
            display = pipelineHybrid;
        }
        return display ? [...display.querySelectorAll('.pipeline-stage')] : [];
    };

    if (btnPipeline) {
        btnPipeline.addEventListener('click', () => {
            const stages = getActivePipelineStages();
            if (!stages.length) return;

            stages[currentStage].classList.remove('active');
            const oldVideo = stages[currentStage].querySelector('video');
            if (oldVideo) oldVideo.pause();

            currentStage = (currentStage + 1) % stages.length;
            stages[currentStage].classList.add('active');

            const textElement = stages[currentStage].querySelector('.typewriter');
            if (textElement) {
                textElement.style.animation = 'none';
                textElement.offsetHeight;
                textElement.style.animation = null;
            }

            const newVideo = stages[currentStage].querySelector('video');
            if (newVideo) {
                newVideo.currentTime = 0;
                newVideo.play();
            }
        });
    }

    branchTabs.forEach(tab => {
        tab.addEventListener('click', () => { currentStage = 0; });
    });

    // Showreel
    const btnReel = document.querySelector('.btn-reel');
    const videoOverlay = document.getElementById('video-overlay');
    const showreelVideo = document.getElementById('showreel-video');
    const closeVideo = document.querySelector('.close-video');

    if (btnReel && videoOverlay) {
        btnReel.addEventListener('click', () => {
            appEl.classList.add('glitch-target');
            if (canvas) canvas.classList.add('glitch-target');

            setTimeout(() => {
                document.body.classList.add('visor-shut');
                appEl.style.opacity = '0';
                if (canvas) canvas.style.opacity = '0';
            }, 300);

            setTimeout(() => {
                videoOverlay.classList.remove('hidden');
                videoOverlay.classList.add('active');
                showreelVideo.play();
                document.body.classList.remove('visor-shut');
                appEl.classList.remove('glitch-target');
                if (canvas) canvas.classList.remove('glitch-target');
            }, 800);
        });

        closeVideo.addEventListener('click', () => {
            document.body.classList.add('visor-shut');
            setTimeout(() => {
                showreelVideo.pause();
                videoOverlay.classList.remove('active');
                videoOverlay.classList.add('hidden');
                appEl.style.opacity = '1';
                if (canvas) canvas.style.opacity = '';
                document.body.classList.remove('visor-shut');
                showreelVideo.currentTime = 0;
            }, 500);
        });
    }

    // Audio reactivity
    const audioBtn = document.getElementById('audio-toggle');
    let isAudioActive = false;

    if (audioBtn) {
        audioBtn.addEventListener('click', async () => {
            if (isAudioActive) return;
            try {
                audioBtn.innerText = 'Connecting…';
                const stream = await navigator.mediaDevices.getUserMedia({ audio: true, video: false });
                const audioContext = new (window.AudioContext || window.webkitAudioContext)();
                const analyser = audioContext.createAnalyser();
                audioContext.createMediaStreamSource(stream).connect(analyser);
                analyser.fftSize = 256;
                const dataArray = new Uint8Array(analyser.frequencyBinCount);
                isAudioActive = true;
                audioBtn.innerText = 'Sound active';
                audioBtn.style.color = 'var(--accent)';

                const renderAudioReactivity = () => {
                    if (!isAudioActive) return;
                    requestAnimationFrame(renderAudioReactivity);
                    analyser.getByteFrequencyData(dataArray);
                    let sum = 0;
                    for (let i = 0; i < 10; i++) sum += dataArray[i];
                    const averageBass = sum / 10;
                    if (canvas && !document.body.classList.contains('visor-shut')) {
                        canvas.style.transform = `scale(${1.0 + (averageBass / 255) * 0.08})`;
                        canvas.style.opacity = (0.8 + (averageBass / 255) * 0.4).toFixed(2);
                    }
                };
                renderAudioReactivity();
            } catch (err) {
                console.error('Audio link denied:', err);
                audioBtn.innerText = 'Microphone denied';
                audioBtn.style.color = '#ff0000';
            }
        });
    }

    // Telegram form
    const tgForm = document.getElementById('telegram-form');
    const tgStatus = document.getElementById('tg-status');
    const tgName = document.getElementById('tg-name');
    const tgMessage = document.getElementById('tg-message');
    const tgType = document.getElementById('tg-type');

    if (tgForm) {
        tgForm.addEventListener('submit', async (e) => {
            e.preventDefault();
            const name = tgName.value.trim();
            const message = tgMessage.value.trim();
            const projectType = tgType?.value || 'unknown';
            if (!name || !message || !projectType) return;

            tgStatus.style.color = 'var(--accent)';
            tgStatus.innerText = 'TRANSMITTING...';

            const workerUrl = 'https://mscw-bureau-bot.sinisapre.workers.dev';

            try {
                const response = await fetch(workerUrl, {
                    method: 'POST',
                    headers: { 'Content-Type': 'application/json' },
                    body: JSON.stringify({ name, message, projectType })
                });

                if (response.ok) {
                    tgStatus.style.color = '#00FF00';
                    tgStatus.innerText = 'TRANSMISSION SUCCESSFUL.';
                    tgForm.reset();
                } else {
                    const errorObj = await response.json();
                    throw new Error(errorObj.error || 'Unknown Worker Error');
                }
            } catch (error) {
                console.error('Transmission Error:', error);
                tgStatus.style.color = '#FF0000';
                tgStatus.innerText = 'TRANSMISSION FAILED. RETRY.';
            }
        });
    }

    // Manifesto
    const manifestoTrigger = document.getElementById('manifesto-trigger');
    const manifestoOverlay = document.getElementById('manifesto-overlay');
    const closeManifesto = document.querySelector('.close-manifesto');
    const scrambleTexts = document.querySelectorAll('.scramble-text');

    const scrambleSentence = (el, delay) => {
        const chars = '!<>-_\\\\/[]{}—=+*^?#_010101XYZ';
        const finalWord = el.getAttribute('data-text');
        let frame = 0;
        const totalFrames = 80;

        setTimeout(() => {
            const animate = () => {
                frame++;
                let currentStr = '';
                for (let i = 0; i < finalWord.length; i++) {
                    const settleThreshold = (i / finalWord.length) * totalFrames;
                    if (frame > settleThreshold) currentStr += finalWord[i];
                    else if (finalWord[i] === ' ') currentStr += ' ';
                    else currentStr += chars[Math.floor(Math.random() * chars.length)];
                }
                el.innerText = currentStr;
                if (frame < totalFrames) requestAnimationFrame(animate);
            };
            animate();
        }, delay);
    };

    if (manifestoTrigger && manifestoOverlay) {
        manifestoTrigger.addEventListener('click', () => {
            manifestoOverlay.classList.remove('hidden');
            scrambleTexts.forEach((el, index) => {
                el.innerText = '';
                scrambleSentence(el, index * 800);
            });
        });
        closeManifesto.addEventListener('click', () => {
            manifestoOverlay.classList.add('hidden');
        });
    }
});
