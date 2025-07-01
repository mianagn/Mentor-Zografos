// CMS Data Loader
// This script loads content from YAML files and updates the HTML

class CMSLoader {
    constructor() {
        this.dataPath = '_data/';
        this.init();
    }

    async init() {
        try {
            await this.loadAllData();
        } catch (error) {
            console.log('CMS data not found, using default content');
        }
    }

    async loadYAML(filename) {
        try {
            const response = await fetch(`${this.dataPath}${filename}`);
            if (!response.ok) throw new Error(`Failed to load ${filename}`);
            const yamlText = await response.text();
            return this.parseYAML(yamlText);
        } catch (error) {
            console.warn(`Could not load ${filename}:`, error);
            return null;
        }
    }

    parseYAML(yamlText) {
        // Enhanced YAML parser for the CMS data structure
        const lines = yamlText.split('\n');
        const result = {};
        const stack = [{ obj: result, indent: -1 }];
        let currentArray = null;
        let currentArrayKey = null;

        for (let line of lines) {
            const originalLine = line;
            line = line.trimRight();
            if (!line || line.startsWith('#')) continue;

            const indent = originalLine.length - originalLine.trimLeft().length;
            line = line.trim();

            // Pop stack to correct level
            while (stack.length > 1 && stack[stack.length - 1].indent >= indent) {
                stack.pop();
            }

            const current = stack[stack.length - 1];

            if (line.startsWith('- ')) {
                // Array item
                const content = line.substring(2).trim();
                
                if (!currentArray || currentArrayKey !== current.lastKey) {
                    currentArray = [];
                    currentArrayKey = current.lastKey;
                    if (current.lastKey) {
                        current.obj[current.lastKey] = currentArray;
                    }
                }

                if (content.includes(': ')) {
                    // Object in array
                    const obj = {};
                    const parts = content.split(': ');
                    if (parts.length === 2) {
                        obj[parts[0].trim()] = parts[1].trim().replace(/^["']|["']$/g, '');
                    }
                    currentArray.push(obj);
                    stack.push({ obj: obj, indent: indent, lastKey: null });
                } else {
                    // Simple value in array
                    currentArray.push(content.replace(/^["']|["']$/g, ''));
                }
            } else if (line.includes(': ') && !line.startsWith('- ')) {
                // Key-value pair
                const colonIndex = line.indexOf(': ');
                const key = line.substring(0, colonIndex).trim();
                const value = line.substring(colonIndex + 2).trim();
                
                current.lastKey = key;
                currentArray = null;
                currentArrayKey = null;

                if (value === '' || value === '{}' || value === '[]') {
                    // Empty value, expect nested content
                    if (value === '[]') {
                        current.obj[key] = [];
                    } else {
                        current.obj[key] = {};
                        stack.push({ obj: current.obj[key], indent: indent, lastKey: null });
                    }
                } else {
                    // Direct value
                    const cleanValue = value.replace(/^["']|["']$/g, '');
                    if (cleanValue === 'true') current.obj[key] = true;
                    else if (cleanValue === 'false') current.obj[key] = false;
                    else if (!isNaN(cleanValue) && cleanValue !== '') current.obj[key] = Number(cleanValue);
                    else current.obj[key] = cleanValue;
                }
            } else if (line && current.lastKey && !line.includes(':')) {
                // Continuation of previous value
                const cleanValue = line.replace(/^["']|["']$/g, '');
                if (typeof current.obj[current.lastKey] === 'string') {
                    current.obj[current.lastKey] += ' ' + cleanValue;
                }
            }
        }

        return result;
    }

    async loadAllData() {
        const [site, hero, about, products, contact, navigation, footer, specialOffer] = await Promise.all([
            this.loadYAML('site.yml'),
            this.loadYAML('hero.yml'),
            this.loadYAML('about.yml'),
            this.loadYAML('products.yml'),
            this.loadYAML('contact.yml'),
            this.loadYAML('navigation.yml'),
            this.loadYAML('footer.yml'),
            this.loadYAML('special_offer.yml')
        ]);

        if (site) this.updateSiteData(site);
        if (hero) this.updateHeroData(hero);
        if (about) this.updateAboutData(about);
        if (products) this.updateProductsData(products);
        if (contact) this.updateContactData(contact);
        if (navigation) this.updateNavigationData(navigation);
        if (footer) this.updateFooterData(footer);
        if (specialOffer) this.updateSpecialOfferData(specialOffer);
    }

    updateSiteData(data) {
        if (data.title) {
            document.title = data.title;
        }
        if (data.description) {
            const metaDesc = document.querySelector('meta[name="description"]');
            if (metaDesc) metaDesc.content = data.description;
        }
        if (data.logo) {
            const logoImg = document.querySelector('.logo-img');
            if (logoImg) logoImg.src = data.logo;
        }
    }

    updateHeroData(data) {
        if (data.title) {
            // Update typewriter text (this will be handled by the existing typewriter script)
            window.heroTitle = data.title;
        }
        if (data.subtitle) {
            const subtitle = document.querySelector('.hero-subtitle');
            if (subtitle) subtitle.textContent = data.subtitle;
        }
        if (data.buttons && Array.isArray(data.buttons)) {
            const buttonsContainer = document.querySelector('.hero-buttons');
            if (buttonsContainer) {
                buttonsContainer.innerHTML = '';
                data.buttons.forEach(button => {
                    const btnElement = document.createElement('a');
                    btnElement.href = button.link;
                    btnElement.className = `btn btn-${button.style}`;
                    btnElement.textContent = button.text;
                    buttonsContainer.appendChild(btnElement);
                });
            }
        }
    }

    updateAboutData(data) {
        if (data.title) {
            const title = document.querySelector('#about .section-title');
            if (title) title.textContent = data.title;
        }
        if (data.subtitle) {
            const subtitle = document.querySelector('#about .section-subtitle');
            if (subtitle) subtitle.textContent = data.subtitle;
        }
        if (data.content && Array.isArray(data.content)) {
            const textContainer = document.querySelector('.about-text');
            if (textContainer) {
                textContainer.innerHTML = '';
                data.content.forEach(paragraph => {
                    const p = document.createElement('p');
                    p.textContent = paragraph;
                    textContainer.appendChild(p);
                });
            }
        }
        if (data.features && Array.isArray(data.features)) {
            const featuresContainer = document.querySelector('.about-features');
            if (featuresContainer) {
                featuresContainer.innerHTML = '';
                data.features.forEach(feature => {
                    const featureDiv = document.createElement('div');
                    featureDiv.className = 'feature';
                    featureDiv.innerHTML = `
                        <div class="feature-icon">
                            <i class="${feature.icon}"></i>
                        </div>
                        <h3>${feature.title}</h3>
                        <p>${feature.description}</p>
                    `;
                    featuresContainer.appendChild(featureDiv);
                });
            }
        }
    }

    updateProductsData(data) {
        if (data.title) {
            const title = document.querySelector('#products .section-title');
            if (title) title.textContent = data.title;
        }
        if (data.subtitle) {
            const subtitle = document.querySelector('#products .section-subtitle');
            if (subtitle) subtitle.textContent = data.subtitle;
        }
        if (data.categories && Array.isArray(data.categories)) {
            const grid = document.querySelector('.products-grid');
            if (grid) {
                grid.innerHTML = '';
                data.categories.forEach(category => {
                    const categoryDiv = document.createElement('div');
                    categoryDiv.className = 'product-category';
                    if (category.featured) {
                        categoryDiv.classList.add('featured');
                    }
                    categoryDiv.innerHTML = `
                        <div class="product-icon">
                            <i class="${category.icon}"></i>
                        </div>
                        <h3>${category.name}</h3>
                        <p>${category.description}</p>
                    `;
                    grid.appendChild(categoryDiv);
                });
            }
        }
    }

    updateContactData(data) {
        if (data.title) {
            const title = document.querySelector('#contact .section-title');
            if (title) title.textContent = data.title;
        }
        if (data.subtitle) {
            const subtitle = document.querySelector('#contact .section-subtitle');
            if (subtitle) subtitle.textContent = data.subtitle;
        }
        
        // Update contact items
        const contactInfo = document.querySelector('.contact-info');
        if (contactInfo && data.address && data.phones && data.email) {
            // Update address
            const addressP = contactInfo.querySelector('.contact-item:first-child .contact-details p');
            if (addressP) addressP.textContent = data.address.street;
            
            // Update phones
            const phoneDetails = contactInfo.querySelector('.contact-item:nth-child(2) .contact-details');
            if (phoneDetails && data.phones) {
                phoneDetails.innerHTML = '<h3>Τηλέφωνα</h3>';
                data.phones.forEach(phone => {
                    const p = document.createElement('p');
                    p.textContent = `${phone.label}: ${phone.number}`;
                    phoneDetails.appendChild(p);
                });
            }
            
            // Update email
            const emailP = contactInfo.querySelector('.contact-item:nth-child(3) .contact-details p');
            if (emailP) emailP.textContent = data.email;
        }
        
        if (data.map_embed) {
            const iframe = document.querySelector('.map-container iframe');
            if (iframe) iframe.src = data.map_embed;
        }
    }

    updateNavigationData(data) {
        if (data.items && Array.isArray(data.items)) {
            const navMenu = document.querySelector('.nav-menu');
            if (navMenu) {
                navMenu.innerHTML = '';
                data.items.sort((a, b) => a.order - b.order).forEach(item => {
                    const link = document.createElement('a');
                    link.href = item.link;
                    link.className = 'nav-link';
                    link.textContent = item.text;
                    navMenu.appendChild(link);
                });
            }
        }
    }

    updateFooterData(data) {
        const footerBottom = document.querySelector('.footer-bottom p');
        if (footerBottom) {
            footerBottom.innerHTML = `${data.copyright} | Κατασκευή - Φιλοξενία: <a href="${data.developer_link}">${data.developer_name}</a>`;
        }
    }

    updateSpecialOfferData(data) {
        const popup = document.querySelector('#specialOfferPopup');
        if (!popup) return;
        
        if (!data.enabled) {
            popup.style.display = 'none';
            return;
        }
        
        const title = popup.querySelector('h3');
        const description = popup.querySelector('p');
        const button = popup.querySelector('.btn-popup');
        
        if (title && data.title) title.textContent = data.title;
        if (description && data.description) description.textContent = data.description;
        if (button && data.button_text) button.textContent = data.button_text;
        if (button && data.button_link) button.href = data.button_link;
    }
}

// Initialize CMS loader when DOM is ready
document.addEventListener('DOMContentLoaded', () => {
    new CMSLoader();
});
