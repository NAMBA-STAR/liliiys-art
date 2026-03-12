// =========================================
// DOM Content Loaded
// =========================================
document.addEventListener('DOMContentLoaded', function() {
    // 初期化
    initHeader();
    initHamburgerMenu();
    initSmoothScroll();
    initScrollAnimations();
    initFAQ();
    initContactForm();
    initPageTop();
});

// =========================================
// ヘッダーのスクロール対応
// =========================================
function initHeader() {
    const header = document.getElementById('header');
    
    window.addEventListener('scroll', function() {
        if (window.scrollY > 100) {
            header.classList.add('scrolled');
        } else {
            header.classList.remove('scrolled');
        }
    });
}

// =========================================
// ハンバーガーメニュー
// =========================================
function initHamburgerMenu() {
    const hamburger = document.getElementById('hamburger');
    const nav = document.getElementById('nav');
    const navLinks = document.querySelectorAll('.nav-link');
    
    // ハンバーガーボタンのクリック
    hamburger.addEventListener('click', function() {
        hamburger.classList.toggle('active');
        nav.classList.toggle('active');
        
        // ボディのスクロールを制御
        if (nav.classList.contains('active')) {
            document.body.style.overflow = 'hidden';
        } else {
            document.body.style.overflow = '';
        }
    });
    
    // ナビリンクをクリックしたらメニューを閉じる
    navLinks.forEach(link => {
        link.addEventListener('click', function() {
            hamburger.classList.remove('active');
            nav.classList.remove('active');
            document.body.style.overflow = '';
        });
    });
    
    // メニュー外をクリックしたら閉じる
    document.addEventListener('click', function(e) {
        if (!nav.contains(e.target) && !hamburger.contains(e.target)) {
            hamburger.classList.remove('active');
            nav.classList.remove('active');
            document.body.style.overflow = '';
        }
    });
}

// =========================================
// スムーススクロール
// =========================================
function initSmoothScroll() {
    const links = document.querySelectorAll('a[href^="#"]');
    
    links.forEach(link => {
        link.addEventListener('click', function(e) {
            const href = this.getAttribute('href');
            
            // href が "#" だけの場合はスキップ
            if (href === '#') {
                e.preventDefault();
                return;
            }
            
            const targetId = href.substring(1);
            const targetElement = document.getElementById(targetId);
            
            if (targetElement) {
                e.preventDefault();
                
                // ヘッダーの高さを取得
                const header = document.getElementById('header');
                const headerHeight = header.offsetHeight;
                
                // スクロール位置を計算
                const targetPosition = targetElement.getBoundingClientRect().top + window.pageYOffset - headerHeight;
                
                // スムーススクロール
                window.scrollTo({
                    top: targetPosition,
                    behavior: 'smooth'
                });
            }
        });
    });
}

// =========================================
// スクロールアニメーション
// =========================================
function initScrollAnimations() {
    const fadeElements = document.querySelectorAll('.fade-in');
    
    // Intersection Observer のオプション
    const observerOptions = {
        root: null,
        rootMargin: '0px',
        threshold: 0.1
    };
    
    // Intersection Observer のコールバック
    const observerCallback = (entries, observer) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.classList.add('visible');
                // 一度表示されたら監視を解除（オプション）
                // observer.unobserve(entry.target);
            }
        });
    };
    
    // Observer を作成
    const observer = new IntersectionObserver(observerCallback, observerOptions);
    
    // 各要素を監視
    fadeElements.forEach(element => {
        observer.observe(element);
    });
}

// =========================================
// FAQ アコーディオン
// =========================================
function initFAQ() {
    const faqItems = document.querySelectorAll('.faq-item');
    
    faqItems.forEach(item => {
        const question = item.querySelector('.faq-question');
        const answer = item.querySelector('.faq-answer');
        
        question.addEventListener('click', function() {
            // 現在のアイテムがアクティブかどうか
            const isActive = item.classList.contains('active');
            
            // すべてのFAQアイテムを閉じる
            faqItems.forEach(otherItem => {
                otherItem.classList.remove('active');
                const otherAnswer = otherItem.querySelector('.faq-answer');
                otherAnswer.style.maxHeight = null;
            });
            
            // クリックされたアイテムがアクティブでなければ開く
            if (!isActive) {
                item.classList.add('active');
                answer.style.maxHeight = answer.scrollHeight + 'px';
            }
        });
    });
}

// =========================================
// お問い合わせフォーム
// =========================================
function initContactForm() {
    const form = document.getElementById('contactForm');
    const formMessage = document.getElementById('formMessage');
    
    form.addEventListener('submit', function(e) {
        e.preventDefault();
        
        // フォームデータを取得
        const formData = {
            salonName: document.getElementById('salonName').value,
            name: document.getElementById('name').value,
            email: document.getElementById('email').value,
            phone: document.getElementById('phone').value,
            message: document.getElementById('message').value,
            sample: document.getElementById('sample').checked
        };
        
        // バリデーション
        if (!validateForm(formData)) {
            showFormMessage('すべての必須項目を入力してください。', 'error');
            return;
        }
        
        // 送信処理のシミュレーション
        showFormMessage('送信中...', 'info');
        
        // 実際のプロジェクトでは、ここでAPIにデータを送信
        // fetch('/api/contact', { method: 'POST', body: JSON.stringify(formData) })
        
        // シミュレーション：2秒後に成功メッセージを表示
        setTimeout(function() {
            showFormMessage('お問い合わせありがとうございます。担当者より折り返しご連絡いたします。', 'success');
            form.reset();
            
            // コンソールにデータを出力（開発用）
            console.log('Form Data:', formData);
        }, 2000);
    });
}

// フォームバリデーション
function validateForm(data) {
    // 必須項目のチェック
    if (!data.salonName || !data.name || !data.email || !data.phone || !data.message) {
        return false;
    }
    
    // メールアドレスの形式チェック
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(data.email)) {
        showFormMessage('正しいメールアドレスを入力してください。', 'error');
        return false;
    }
    
    // 電話番号の形式チェック（簡易版）
    const phoneRegex = /^[\d\-\+\(\)\s]+$/;
    if (!phoneRegex.test(data.phone)) {
        showFormMessage('正しい電話番号を入力してください。', 'error');
        return false;
    }
    
    return true;
}

// フォームメッセージの表示
function showFormMessage(message, type) {
    const formMessage = document.getElementById('formMessage');
    formMessage.textContent = message;
    formMessage.className = 'form-message ' + type;
    formMessage.style.display = 'block';
    
    // エラーメッセージは自動的に消えない
    if (type === 'success' || type === 'info') {
        setTimeout(function() {
            if (type === 'success') {
                formMessage.style.display = 'none';
            }
        }, 5000);
    }
}

// =========================================
// ページトップボタン
// =========================================
function initPageTop() {
    const pageTopButton = document.getElementById('pageTop');
    
    // スクロール時の表示/非表示
    window.addEventListener('scroll', function() {
        if (window.scrollY > 300) {
            pageTopButton.classList.add('visible');
        } else {
            pageTopButton.classList.remove('visible');
        }
    });
    
    // クリック時のスクロール
    pageTopButton.addEventListener('click', function() {
        window.scrollTo({
            top: 0,
            behavior: 'smooth'
        });
    });
}

// =========================================
// ユーティリティ関数
// =========================================

// デバウンス関数（パフォーマンス最適化用）
function debounce(func, wait) {
    let timeout;
    return function executedFunction(...args) {
        const later = () => {
            clearTimeout(timeout);
            func(...args);
        };
        clearTimeout(timeout);
        timeout = setTimeout(later, wait);
    };
}

// スロットル関数（パフォーマンス最適化用）
function throttle(func, limit) {
    let inThrottle;
    return function(...args) {
        if (!inThrottle) {
            func.apply(this, args);
            inThrottle = true;
            setTimeout(() => inThrottle = false, limit);
        }
    };
}

// =========================================
// ウィンドウリサイズ対応
// =========================================
window.addEventListener('resize', debounce(function() {
    // ウィンドウサイズが変わったときの処理
    const nav = document.getElementById('nav');
    const hamburger = document.getElementById('hamburger');
    
    // デスクトップサイズに戻ったらメニューを閉じる
    if (window.innerWidth > 768) {
        nav.classList.remove('active');
        hamburger.classList.remove('active');
        document.body.style.overflow = '';
    }
}, 250));

// =========================================
// スクロールパフォーマンス最適化
// =========================================
let ticking = false;

window.addEventListener('scroll', function() {
    if (!ticking) {
        window.requestAnimationFrame(function() {
            // スクロール時の処理をここに追加
            ticking = false;
        });
        ticking = true;
    }
});

// =========================================
// タッチデバイス対応
// =========================================
if ('ontouchstart' in window || navigator.maxTouchPoints) {
    document.body.classList.add('touch-device');
}

// =========================================
// コンソールウェルカムメッセージ
// =========================================
console.log('%c🌿 WAXPRO Official Website', 'color: #6B8E7F; font-size: 20px; font-weight: bold;');
console.log('%cプロフェッショナル向けワックス製品', 'color: #555; font-size: 14px;');
console.log('%c開発: Website専門エージェント', 'color: #777; font-size: 12px;');

// =========================================
// アクセシビリティ対応
// =========================================

// キーボードナビゲーション
document.addEventListener('keydown', function(e) {
    // Escキーでメニューを閉じる
    if (e.key === 'Escape') {
        const nav = document.getElementById('nav');
        const hamburger = document.getElementById('hamburger');
        
        if (nav.classList.contains('active')) {
            nav.classList.remove('active');
            hamburger.classList.remove('active');
            document.body.style.overflow = '';
        }
        
        // アクティブなFAQを閉じる
        const activeFaq = document.querySelector('.faq-item.active');
        if (activeFaq) {
            activeFaq.classList.remove('active');
            const answer = activeFaq.querySelector('.faq-answer');
            answer.style.maxHeight = null;
        }
    }
});

// フォーカス可視化
document.addEventListener('keydown', function(e) {
    if (e.key === 'Tab') {
        document.body.classList.add('keyboard-nav');
    }
});

document.addEventListener('mousedown', function() {
    document.body.classList.remove('keyboard-nav');
});

// =========================================
// パフォーマンス計測（開発用）
// =========================================
if (window.performance && window.performance.timing) {
    window.addEventListener('load', function() {
        setTimeout(function() {
            const perfData = window.performance.timing;
            const pageLoadTime = perfData.loadEventEnd - perfData.navigationStart;
            const connectTime = perfData.responseEnd - perfData.requestStart;
            const renderTime = perfData.domComplete - perfData.domLoading;
            
            console.log('📊 Performance Metrics:');
            console.log(`   Page Load Time: ${pageLoadTime}ms`);
            console.log(`   Connect Time: ${connectTime}ms`);
            console.log(`   Render Time: ${renderTime}ms`);
        }, 0);
    });
}

// =========================================
// エラーハンドリング
// =========================================
window.addEventListener('error', function(e) {
    console.error('エラーが発生しました:', e.message);
    // 本番環境では、エラーログをサーバーに送信する処理を追加
});

// =========================================
// 開発モード検出
// =========================================
const isDevelopment = window.location.hostname === 'localhost' || 
                       window.location.hostname === '127.0.0.1' ||
                       window.location.hostname === '';

if (isDevelopment) {
    console.log('%c⚙️ Development Mode', 'color: orange; font-weight: bold;');
}
