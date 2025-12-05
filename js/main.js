const products = {
  camisetas: [
    {
      id: 'camiseta-1',
      name: 'SóTrickDeRespeito',
      price: 69.90,
      image: 'img/peita.png',
      images: [
        'img/peita.png',
        'img/peitap.png',
        'img/peitam.png'
      ],
      sizes: ['M', 'G', 'GG'],
      colors: [
        { name: 'Branco', code: '#FFFFFF' },
        { name: 'Preto', code: '#000000' },
        { name: 'Marrom', code: '#8B4513' }
      ],
      category: 'camisetas',
      badge: 'Novidade',
      description: 'Camiseta premium com estampa exclusiva So Trick de Respeito. Feita em algodão 100% com qualidade premium.'
    },
    {
      id: 'camiseta-2',
      name: 'SóTrickDeRespeito X Vamp',
      price: 199.90,
      image: 'img/peita2.png',
      images: [
        'img/peita2.png',
        'img/peita2.png'
      ],
      sizes: ['M', 'G', 'GG'],
      colors: [
        { name: 'Branco', code: '#FFFFFF' }
      ],
      category: 'camisetas',
      badge: 'SóTrickDeRespeito X Vamp',
      description: 'A fusão do street raiz com o Universo Vamp. A collab SóTrickDeRespeito X Vamp entrega identidade, arte e exclusividade em uma peça premium limitada.'
    },
  ],
};


    let cart = JSON.parse(localStorage.getItem('sotrick_cart')) || [];

    function saveCart() {
      localStorage.setItem('sotrick_cart', JSON.stringify(cart));
    }

    function updateCartCount() {
      const total = cart.reduce((sum, item) => sum + item.quantity, 0);
      document.getElementById('cart-count').textContent = total;
    }

    function renderProducts() {
      function buildCard(product) {
        return `
          <div class="product-card">
            ${product.badge ? `<div class="product-badge">${product.badge}</div>` : ''}
            <div class="product-image">
              <img src="${product.image}" alt="${product.name}" 
                   onerror="this.onerror=null; this.src='https://via.placeholder.com/400x500?text=Produto+${product.name.replace(' ', '+')}'">
            </div>
            <div class="product-info">
              <h3 class="product-title">${product.name}</h3>
              <p class="product-price">R$ ${product.price.toFixed(2)}</p>
              <button class="btn view-details" 
                data-id="${product.id}" 
                data-category="${product.category}">
                Ver Detalhes
              </button>
            </div>
          </div>
        `;
      }

      document.getElementById('camisetas-container').innerHTML = 
        `<div class="product-grid">${products.camisetas.map(buildCard).join('')}</div>`;
    }

    let currentProduct = null;
    let selectedColor = null;
    let selectedSize = null;

    function openProductModal(product) {
      currentProduct = product;
      
      document.getElementById('modal-title').textContent = product.name;
      document.getElementById('modal-price').textContent = `R$ ${product.price.toFixed(2)}`;
      document.getElementById('modal-description').textContent = product.description;
      document.getElementById('modal-image').src = product.images[0];
      
      const colorsContainer = document.getElementById('modal-colors');
      colorsContainer.innerHTML = '';
      
      product.colors.forEach((color, index) => {
        const colorBtn = document.createElement('div');
        colorBtn.className = `color-option ${index === 0 ? 'active' : ''}`;
        colorBtn.innerHTML = `
          <span class="color-sample" style="background: ${color.code}"></span>
          ${color.name}
        `;
        colorBtn.onclick = () => {
          document.querySelectorAll('.color-option').forEach(btn => btn.classList.remove('active'));
          colorBtn.classList.add('active');
          selectedColor = color.name;
          
          if (product.images.length > index) {
            document.getElementById('modal-image').src = product.images[index];
          }
        };
        colorsContainer.appendChild(colorBtn);
      });
      
      if (product.colors.length > 0) {
        selectedColor = product.colors[0].name;
      }
      
      const sizesContainer = document.getElementById('modal-sizes');
      sizesContainer.innerHTML = '';
      
      product.sizes.forEach((size, index) => {
        const sizeBtn = document.createElement('div');
        sizeBtn.className = `size-option ${index === 0 ? 'active' : ''}`;
        sizeBtn.textContent = size;
        sizeBtn.onclick = () => {
          document.querySelectorAll('.size-option').forEach(btn => btn.classList.remove('active'));
          sizeBtn.classList.add('active');
          selectedSize = size;
        };
        sizesContainer.appendChild(sizeBtn);
      });
      
      if (product.sizes.length > 0) {
        selectedSize = product.sizes[0];
      }
      
      document.getElementById('product-modal').style.display = 'flex';
    }

    function closeProductModal() {
      document.getElementById('product-modal').style.display = 'none';
    }

    function openCartModal() {
      document.getElementById('cart-modal').style.display = 'flex';
      renderCart();
    }

    function closeCartModal() {
      document.getElementById('cart-modal').style.display = 'none';
    }

    function renderCart() {
      const cartItems = document.getElementById('cart-items');
      
      if (cart.length === 0) {
        cartItems.innerHTML = `
          <div class="empty-cart">
            <i class="fas fa-shopping-cart"></i>
            <p>Seu carrinho está vazio</p>
          </div>
        `;
        document.getElementById('total-price').textContent = '0.00';
        return;
      }

      let html = '';
      let total = 0;

      cart.forEach(item => {
        const subtotal = item.price * item.quantity;
        total += subtotal;

        html += `
          <div class="cart-item">
            <div class="cart-item-header">
              <h4 class="cart-item-name">${item.name}</h4>
              <button class="cart-item-remove" data-id="${item.id}">
                <i class="fas fa-trash"></i>
              </button>
            </div>
            <div class="cart-item-details">
              Cor: ${item.color} | Tamanho: ${item.size}
            </div>
            <div class="cart-item-controls">
              <div class="cart-item-price">R$ ${subtotal.toFixed(2)}</div>
              <div class="cart-item-quantity">
                <button class="qty-btn" data-id="${item.id}" data-action="decrease">-</button>
                <span>${item.quantity}</span>
                <button class="qty-btn" data-id="${item.id}" data-action="increase">+</button>
              </div>
            </div>
          </div>
        `;
      });

      cartItems.innerHTML = html;
      document.getElementById('total-price').textContent = total.toFixed(2);
    }

    document.getElementById('modal-add-to-cart').onclick = () => {
      if (!selectedColor || !selectedSize) {
        alert('Por favor, selecione cor e tamanho!');
        return;
      }

      const itemId = `${currentProduct.id}-${selectedColor}-${selectedSize}`;
      const existingItem = cart.find(item => item.id === itemId);

      if (existingItem) {
        existingItem.quantity++;
      } else {
        cart.push({
          id: itemId,
          productId: currentProduct.id,
          name: currentProduct.name,
          color: selectedColor,
          size: selectedSize,
          price: currentProduct.price,
          quantity: 1,
          image: currentProduct.image
        });
      }

      saveCart();
      updateCartCount();
      showNotification(`${currentProduct.name} adicionado ao carrinho!`);
      closeProductModal();
    };

    function showNotification(message) {
      const notification = document.createElement('div');
      notification.style.cssText = `
        position: fixed;
        bottom: 20px;
        left: 50%;
        transform: translateX(-50%);
        background: var(--accent);
        color: var(--black);
        padding: 15px 25px;
        border-radius: 5px;
        font-family: 'PixoReto', sans-serif;
        font-weight: bold;
        z-index: 10000;
        animation: slideUp 0.3s ease;
      `;
      notification.textContent = message;
      document.body.appendChild(notification);
      
      setTimeout(() => {
        notification.style.animation = 'slideDown 0.3s ease';
        setTimeout(() => {
          document.body.removeChild(notification);
        }, 300);
      }, 2000);
    }

    function checkout() {
      if (cart.length === 0) {
        showNotification('Seu carrinho está vazio!');
        return;
      }

      const name = document.getElementById('customer-name').value.trim();
      const phone = document.getElementById('customer-phone').value.trim();
      const address = document.getElementById('customer-address').value.trim();

      if (!name || !phone || !address) {
        showNotification('Preencha todas as informações de entrega!');
        return;
      }

      const phoneRegex = /^\(?\d{2}\)?\s?\d{4,5}-?\d{4}$/;
      if (!phoneRegex.test(phone)) {
        showNotification('Telefone inválido! Use o formato (11) 99999-9999');
        return;
      }

      let message = `*PEDIDO - SO TRICK DE RESPEITO*\n\n`;
      message += `*Cliente:* ${name}\n`;
      message += `*Telefone:* ${phone}\n`;
      message += `*Endereço:* ${address}\n\n`;
      message += `*ITENS DO PEDIDO:*\n\n`;

      let total = 0;
      cart.forEach((item, index) => {
        const subtotal = item.price * item.quantity;
        total += subtotal;
        message += `${index + 1}. ${item.name}\n`;
        message += `   Cor: ${item.color} | Tamanho: ${item.size}\n`;
        message += `   Quantidade: ${item.quantity} x R$ ${item.price.toFixed(2)}\n`;
        message += `   Subtotal: R$ ${subtotal.toFixed(2)}\n\n`;
      });

      message += `*TOTAL DO PEDIDO: R$ ${total.toFixed(2)}*\n\n`;
      message += `*Obrigado pelo pedido!*`;

      const encodedMessage = encodeURIComponent(message);
      const whatsappNumber = '5511978863353';
      
      window.open(`https://wa.me/${whatsappNumber}?text=${encodedMessage}`, '_blank');
    }


    document.addEventListener('DOMContentLoaded', () => {
      renderProducts();
      updateCartCount();

      document.addEventListener('click', (e) => {
        if (e.target.classList.contains('view-details')) {
          const id = e.target.dataset.id;
          const category = e.target.dataset.category;
          const product = products[category].find(p => p.id === id);
          if (product) openProductModal(product);
        }
      });

      document.getElementById('close-modal').onclick = closeProductModal;
      document.getElementById('close-cart-modal').onclick = closeCartModal;
      
      document.getElementById('product-modal').onclick = (e) => {
        if (e.target === document.getElementById('product-modal')) {
          closeProductModal();
        }
      };
      
      document.getElementById('cart-modal').onclick = (e) => {
        if (e.target === document.getElementById('cart-modal')) {
          closeCartModal();
        }
      };

      document.getElementById('cart-icon-btn').onclick = openCartModal;

      document.addEventListener('click', (e) => {
        if (e.target.closest('.cart-item-remove')) {
          const btn = e.target.closest('.cart-item-remove');
          const itemId = btn.dataset.id;
          cart = cart.filter(item => item.id !== itemId);
          saveCart();
          updateCartCount();
          renderCart();
          showNotification('Item removido do carrinho');
        }

        if (e.target.classList.contains('qty-btn')) {
          const itemId = e.target.dataset.id;
          const action = e.target.dataset.action;
          const item = cart.find(item => item.id === itemId);

          if (item) {
            if (action === 'increase') {
              item.quantity++;
            } else if (action === 'decrease') {
              if (item.quantity > 1) {
                item.quantity--;
              } else {
                cart = cart.filter(i => i.id !== itemId);
                showNotification('Item removido do carrinho');
              }
            }
            saveCart();
            updateCartCount();
            renderCart();
          }
        }
      });

      document.getElementById('clear-cart').onclick = () => {
        if (cart.length === 0) {
          showNotification('O carrinho já está vazio!');
          return;
        }
        
        if (confirm('Tem certeza que deseja limpar o carrinho?')) {
          cart = [];
          saveCart();
          updateCartCount();
          renderCart();
          showNotification('Carrinho limpo');
        }
      };

      document.getElementById('checkout-btn').onclick = checkout;

      document.getElementById('customer-phone').addEventListener('input', function(e) {
        let value = e.target.value.replace(/\D/g, '');
        if (value.length > 11) value = value.substring(0, 11);
        
        if (value.length > 0) {
          value = value.replace(/^(\d{2})(\d)/g, '($1) $2');
          if (value.length > 10) {
            value = value.replace(/(\d{5})(\d)/, '$1-$2');
          } else {
            value = value.replace(/(\d{4})(\d)/, '$1-$2');
          }
        }
        
        e.target.value = value;
      });

      document.querySelectorAll('nav a:not(.cart-icon-btn)').forEach(anchor => {
        anchor.addEventListener('click', function(e) {
          const href = this.getAttribute('href');
          if (href.startsWith('#')) {
            e.preventDefault();
            const targetId = href.substring(1);
            const targetElement = document.getElementById(targetId);
            if (targetElement) {
              targetElement.scrollIntoView({ behavior: 'smooth' });
            }
          }
        });
      });

      document.addEventListener('error', function(e) {
        if (e.target.tagName === 'IMG') {
          e.target.src = 'https://via.placeholder.com/400x500?text=Imagem+Não+Carregou';
          e.target.onerror = null;
        }
      }, true);
    });