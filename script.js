// Esperar o DOM carregar completamente
document.addEventListener('DOMContentLoaded', () => {
    // Inicializar AOS (Animate on Scroll)
    AOS.init({
        duration: 1000,
        once: true,
        offset: 100
    });

    // Remover loader quando a página carregar
    const loader = document.getElementById('loader');
    if (loader) {
        window.addEventListener('load', () => {
            loader.style.opacity = '0';
            setTimeout(() => {
                loader.style.display = 'none';
            }, 500);
        });
    }

    // Coordenadas de Pé de Serra, BA
    const PE_DE_SERRA = { lat: -11.8375, lng: -39.6111 };

    // Pontos turísticos
    const PONTOS_TURISTICOS = [
        {
            nome: "Serra do Leão",
            posicao: { lat: -11.8275, lng: -39.6011 },
            descricao: "Majestosa formação rochosa que oferece trilhas e vistas panorâmicas incríveis.",
            dificuldade: "Moderada",
            duracao: "4-6 horas"
        },
        {
            nome: "Minadouro",
            posicao: { lat: -11.8475, lng: -39.6211 },
            descricao: "Local de águas cristalinas perfeito para banho e relaxamento.",
            dificuldade: "Fácil",
            duracao: "2-3 horas"
        },
        {
            nome: "Serra do Bugi",
            posicao: { lat: -11.8575, lng: -39.6311 },
            descricao: "Ponto mais alto da região, oferecendo vistas deslumbrantes.",
            dificuldade: "Difícil",
            duracao: "6-8 horas"
        }
    ];

    // Header fixo com mudança no scroll
    const header = document.querySelector('header');
    const headerHeight = header.offsetHeight;

    window.addEventListener('scroll', () => {
        if (window.scrollY > headerHeight) {
            header.classList.add('scrolled');
        } else {
            header.classList.remove('scrolled');
        }
    });

    // Menu mobile
    const menuToggle = document.querySelector('.menu-toggle');
    const navLinks = document.querySelector('.nav-links');

    if (menuToggle) {
        menuToggle.addEventListener('click', () => {
            navLinks.classList.toggle('active');
            menuToggle.classList.toggle('active');
        });
    }

    // Fechar menu ao clicar em um link
    document.querySelectorAll('.nav-links a').forEach(link => {
        link.addEventListener('click', () => {
            navLinks.classList.remove('active');
            menuToggle.classList.remove('active');
        });
    });

    // Slider Hero
    let currentSlide = 0;
    const slides = document.querySelectorAll('.slide');
    const totalSlides = slides.length;

    function updateSlider() {
        slides.forEach(slide => slide.classList.remove('active'));
        slides[currentSlide].classList.add('active');
    }

    function nextSlide() {
        currentSlide = (currentSlide + 1) % totalSlides;
        updateSlider();
    }

    function prevSlide() {
        currentSlide = (currentSlide - 1 + totalSlides) % totalSlides;
        updateSlider();
    }

    // Controles do slider
    document.querySelector('.slider-controls .next')?.addEventListener('click', nextSlide);
    document.querySelector('.slider-controls .prev')?.addEventListener('click', prevSlide);

    // Autoplay do slider
    setInterval(nextSlide, 5000);

    // Contador de estatísticas
    function startCounter(element) {
        const target = parseInt(element.getAttribute('data-target'));
        const duration = 2000; // 2 segundos
        const step = target / (duration / 16); // 60fps
        let current = 0;

        const counter = setInterval(() => {
            current += step;
            if (current >= target) {
                element.textContent = target;
                clearInterval(counter);
            } else {
                element.textContent = Math.floor(current);
            }
        }, 16);
    }

    // Iniciar contadores quando visíveis
    const observerOptions = {
        threshold: 0.5
    };

    const observer = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                const counters = entry.target.querySelectorAll('.counter');
                counters.forEach(counter => startCounter(counter));
                observer.unobserve(entry.target);
            }
        });
    }, observerOptions);

    document.querySelector('.estatisticas')?.forEach(el => observer.observe(el));

    // Filtros da Galeria
    const filterButtons = document.querySelectorAll('.filtro-btn');
    const galeriaGrid = document.querySelector('.galeria-grid');

    filterButtons.forEach(button => {
        button.addEventListener('click', () => {
            // Remover classe active de todos os botões
            filterButtons.forEach(btn => btn.classList.remove('active'));
            button.classList.add('active');

            const filter = button.getAttribute('data-filter');
            const items = document.querySelectorAll('.galeria-item');

            items.forEach(item => {
                if (filter === 'todos' || item.classList.contains(filter)) {
                    item.style.display = 'block';
                } else {
                    item.style.display = 'none';
                }
            });
        });
    });

    // Lightbox da Galeria
    const galeriaItems = document.querySelectorAll('.galeria-item');
    
    galeriaItems.forEach(item => {
        item.addEventListener('click', () => {
            const lightbox = document.createElement('div');
            lightbox.className = 'lightbox';
            
            const img = item.querySelector('img').cloneNode();
            const close = document.createElement('button');
            close.className = 'lightbox-close';
            close.innerHTML = '<i class="fas fa-times"></i>';
            
            lightbox.appendChild(img);
            lightbox.appendChild(close);
            document.body.appendChild(lightbox);
            
            setTimeout(() => lightbox.classList.add('active'), 10);
            
            close.addEventListener('click', () => {
                lightbox.classList.remove('active');
                setTimeout(() => lightbox.remove(), 300);
            });
        });
    });

    // Inicialização do Mapa
    function initMap() {
        const map = new google.maps.Map(document.getElementById("mapa"), {
            zoom: 14,
            center: PE_DE_SERRA,
            mapTypeId: 'terrain',
            styles: [
                {
                    featureType: "natural",
                    elementType: "geometry",
                    stylers: [{ color: "#dfd2ae" }]
                }
            ]
        });

        // Adicionar marcadores para cada ponto turístico
        PONTOS_TURISTICOS.forEach(ponto => {
            const marker = new google.maps.Marker({
                position: ponto.posicao,
                map: map,
                title: ponto.nome,
                animation: google.maps.Animation.DROP
            });

            // Janela de informação personalizada
            const infowindow = new google.maps.InfoWindow({
                content: `
                    <div class="map-info">
                        <h3>${ponto.nome}</h3>
                        <p>${ponto.descricao}</p>
                        <div class="info-details">
                            <span><i class="fas fa-clock"></i> ${ponto.duracao}</span>
                            <span><i class="fas fa-signal"></i> ${ponto.dificuldade}</span>
                        </div>
                    </div>
                `
            });

            marker.addListener("click", () => {
                infowindow.open(map, marker);
            });
        });
    }

    // Formulário de Contato
    const form = document.getElementById('contato-form');
    if (form) {
        form.addEventListener('submit', async (e) => {
            e.preventDefault();
            
            const submitButton = form.querySelector('button[type="submit"]');
            const originalText = submitButton.innerHTML;
            submitButton.innerHTML = '<i class="fas fa-spinner fa-spin"></i> Enviando...';
            submitButton.disabled = true;

            try {
                // Aqui você adicionaria a lógica de envio do formulário
                await new Promise(resolve => setTimeout(resolve, 1500)); // Simulação
                
                alert('Mensagem enviada com sucesso! Em breve entraremos em contato.');
                form.reset();
            } catch (error) {
                alert('Erro ao enviar mensagem. Por favor, tente novamente.');
            } finally {
                submitButton.innerHTML = originalText;
                submitButton.disabled = false;
            }
        });
    }

    // Newsletter
    const newsletterForm = document.getElementById('newsletter-form');
    if (newsletterForm) {
        newsletterForm.addEventListener('submit', async (e) => {
            e.preventDefault();
            
            const email = newsletterForm.querySelector('input[type="email"]').value;
            const button = newsletterForm.querySelector('button');
            const originalText = button.innerHTML;
            
            button.innerHTML = '<i class="fas fa-spinner fa-spin"></i>';
            button.disabled = true;

            try {
                // Aqui você adicionaria a lógica de inscrição na newsletter
                await new Promise(resolve => setTimeout(resolve, 1500)); // Simulação
                
                alert('Inscrição realizada com sucesso!');
                newsletterForm.reset();
            } catch (error) {
                alert('Erro ao realizar inscrição. Por favor, tente novamente.');
            } finally {
                button.innerHTML = originalText;
                button.disabled = false;
            }
        });
    }

    // Botão Voltar ao Topo
    const backToTop = document.getElementById('backToTop');
    if (backToTop) {
        window.addEventListener('scroll', () => {
            if (window.scrollY > 500) {
                backToTop.classList.add('visible');
            } else {
                backToTop.classList.remove('visible');
            }
        });

        backToTop.addEventListener('click', () => {
            window.scrollTo({
                top: 0,
                behavior: 'smooth'
            });
        });
    }

    // Smooth Scroll para links internos
    document.querySelectorAll('a[href^="#"]').forEach(anchor => {
        anchor.addEventListener('click', function (e) {
            e.preventDefault();
            const target = document.querySelector(this.getAttribute('href'));
            if (target) {
                const headerOffset = header.offsetHeight;
                const elementPosition = target.offsetTop;
                const offsetPosition = elementPosition - headerOffset;

                window.scrollTo({
                    top: offsetPosition,
                    behavior: "smooth"
                });
            }
        });
    });

    // Tabs de Experiências
    const tabButtons = document.querySelectorAll('.tab-btn');
    const tabContents = document.querySelectorAll('.tab-content');

    tabButtons.forEach(button => {
        button.addEventListener('click', () => {
            const tab = button.getAttribute('data-tab');
            
            tabButtons.forEach(btn => btn.classList.remove('active'));
            tabContents.forEach(content => content.classList.remove('active'));
            
            button.classList.add('active');
            document.getElementById(tab).classList.add('active');
        });
    });
});