// CMS Data Loader
// This script loads content from YAML files and updates the HTML

class CMSLoader {
    constructor() {
        this.dataPath = '_data/';
        this.fallbackData = this.getDefaultData();
        this.init();
    }

    getDefaultData() {
        return {
            site: {
                title: "Mentor Zografos | Αναλώσιμα Φαρμακείου | Διαφημιστικά | Συσκευασία",
                description: "Η εταιρεία Mentor Zografos - Αναλώσιμα φαρμακείων, διαφημιστικά προϊόντα και υπηρεσίες εκτύπωσης από το 2009",
                logo: "/assets/logo.png"
            },
            hero: {
                title: "Τα πάντα για σένα και την επιχείρησή σου!",
                subtitle: "Έξυπνες και πρωτοποριακές προτάσεις στο κλάδο προβολής και προώθησης επιχειρήσεων σε πανελλαδική κλίμακα από το 2009"
            },
            about: {
                title: "Σχετικά με εμάς",
                subtitle: "16 χρόνια εμπειρίας στην προώθηση επιχειρήσεων"
            },
            products: {
                title: "Τα Προϊόντα μας",
                subtitle: "Ολοκληρωμένη γκάμα διαφημιστικών και επαγγελματικών προϊόντων"
            },
            contact: {
                title: "Θα μας βρείτε",
                subtitle: "Επικοινωνήστε μαζί μας για οποιαδήποτε πληροφορία"
            },
            specialOffer: {
                enabled: false
            }
        };
    }

    // Get current content from HTML as fallback
    getCurrentContent() {
        const heroSubtitle = document.querySelector('.hero-subtitle');
        const aboutSubtitle = document.querySelector('#about .section-subtitle');
        const productsSubtitle = document.querySelector('#products .section-subtitle');
        
        return {
            hero: {
                subtitle: heroSubtitle ? heroSubtitle.textContent : this.fallbackData.hero.subtitle
            },
            about: {
                subtitle: aboutSubtitle ? aboutSubtitle.textContent : this.fallbackData.about.subtitle
            },
            products: {
                subtitle: productsSubtitle ? productsSubtitle.textContent : this.fallbackData.products.subtitle
            }
        };
    }

    async init() {
        try {
            console.log('Initializing CMS Loader...');
            
            // First, capture current HTML content
            this.currentContent = this.getCurrentContent();
            
            await this.loadAllData();
        } catch (error) {
            console.log('CMS data not found, preserving existing content:', error);
            // Don't override existing content, just leave it as is
        }
    }

    async loadYAML(filename) {
        try {
            const response = await fetch(`${this.dataPath}${filename}`);
            if (!response.ok) throw new Error(`Failed to load ${filename}`);
            const yamlText = await response.text();
            console.log(`Loading ${filename}:`, yamlText.substring(0, 200) + '...');
            const parsed = this.parseYAML(yamlText);
            console.log(`Parsed ${filename}:`, parsed);
            return parsed;
        } catch (error) {
            console.warn(`Could not load ${filename}:`, error);
            return null;
        }
    }

    parseYAML(yamlText) {
        // Enhanced YAML parser for the CMS data structure
        const lines = yamlText.split('\n');
        const result = {};
        
        // Simple line-by-line parser for basic key-value pairs
        for (let i = 0; i < lines.length; i++) {
            let line = lines[i].trim();
            if (!line || line.startsWith('#')) continue;
            
            // Handle simple key: value pairs
            if (line.includes(': ') && !line.startsWith('- ')) {
                const colonIndex = line.indexOf(': ');
                const key = line.substring(0, colonIndex).trim();
                let value = line.substring(colonIndex + 2).trim();
                
                // Remove quotes if present
                value = value.replace(/^["']|["']$/g, '');
                
                // Handle multi-line values
                if (value === '' && i + 1 < lines.length) {
                    // Check if next lines are indented (part of this value)
                    let nextLine = lines[i + 1];
                    if (nextLine && (nextLine.startsWith('  ') || nextLine.startsWith('\t'))) {
                        // This is a multi-line or nested value
                        if (nextLine.trim().startsWith('-')) {
                            // It's an array
                            result[key] = [];
                            i++; // Move to next line
                            while (i < lines.length) {
                                const arrayLine = lines[i].trim();
                                if (!arrayLine) {
                                    i++;
                                    continue;
                                }
                                if (!arrayLine.startsWith('-')) break;
                                
                                const arrayValue = arrayLine.substring(1).trim();
                                if (arrayValue.includes(': ')) {
                                    // Object in array
                                    const obj = {};
                                    const parts = arrayValue.split(': ');
                                    obj[parts[0].trim()] = parts[1].trim().replace(/^["']|["']$/g, '');
                                    result[key].push(obj);
                                } else {
                                    // Simple value in array
                                    result[key].push(arrayValue.replace(/^["']|["']$/g, ''));
                                }
                                i++;
                            }
                            i--; // Back up one since the loop will increment
                        } else {
                            // It's an object
                            result[key] = {};
                            // Handle nested objects if needed
                        }
                    }
                } else {
                    // Simple value
                    if (value === 'true') result[key] = true;
                    else if (value === 'false') result[key] = false;
                    else if (!isNaN(value) && value !== '') result[key] = Number(value);
                    else result[key] = value;
                }
            }
        }
        
        console.log('YAML parsing result:', result);
        return result;
    }

    async loadAllData() {
        console.log('Loading CMS data from YAML files...');
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

        // Only update content if we have valid CMS data, otherwise preserve existing HTML
        if (site && site.title) this.updateSiteData(site);
        if (hero && hero.title) this.updateHeroData(hero);
        if (about && about.title) this.updateAboutData(about);
        if (products && products.title) this.updateProductsData(products);
        if (contact && contact.title) this.updateContactData(contact);
        if (specialOffer && typeof specialOffer.enabled !== 'undefined') this.updateSpecialOfferData(specialOffer);
        
        // These are optional and only update if data exists
        if (navigation && navigation.items) this.updateNavigationData(navigation);
        if (footer && footer.copyright) this.updateFooterData(footer);
        
        console.log('CMS data loaded successfully');
    }

    loadFallbackData() {
        console.log('Loading fallback data...');
        this.updateSiteData(this.fallbackData.site);
        this.updateHeroData(this.fallbackData.hero);
        this.updateAboutData(this.fallbackData.about);
        this.updateProductsData(this.fallbackData.products);
        this.updateContactData(this.fallbackData.contact);
        this.updateSpecialOfferData(this.fallbackData.specialOffer);
    }

    updateSiteData(data) {
        console.log('Updating site data:', data);
        if (data && data.title) {
            document.title = data.title;
        }
        if (data && data.description) {
            const metaDesc = document.querySelector('meta[name="description"]');
            if (metaDesc) metaDesc.content = data.description;
        }
        if (data && data.logo) {
            const logoImg = document.querySelector('.logo-img');
            if (logoImg) logoImg.src = data.logo;
        }
    }

    updateHeroData(data) {
        console.log('Updating hero data:', data);
        if (data && typeof data.title === 'string' && data.title.trim()) {
            // Update typewriter text (this will be handled by the existing typewriter script)
            window.heroTitle = data.title;
        }
        if (data && typeof data.subtitle === 'string' && data.subtitle.trim()) {
            const subtitle = document.querySelector('.hero-subtitle');
            if (subtitle) subtitle.textContent = data.subtitle;
        }
        if (data && data.buttons && Array.isArray(data.buttons)) {
            const buttonsContainer = document.querySelector('.hero-buttons');
            if (buttonsContainer) {
                buttonsContainer.innerHTML = '';
                data.buttons.forEach(button => {
                    const btnElement = document.createElement('a');
                    btnElement.href = button.link || '#';
                    btnElement.className = `btn btn-${button.style || 'primary'}`;
                    btnElement.textContent = button.text || 'Button';
                    buttonsContainer.appendChild(btnElement);
                });
            }
        }
    }

    updateAboutData(data) {
        console.log('Updating about data:', data);
        if (data && typeof data.title === 'string' && data.title.trim()) {
            const title = document.querySelector('#about .section-title');
            if (title) title.textContent = data.title;
        }
        if (data && typeof data.subtitle === 'string' && data.subtitle.trim()) {
            const subtitle = document.querySelector('#about .section-subtitle');
            if (subtitle) subtitle.textContent = data.subtitle;
        }
        if (data && data.content && Array.isArray(data.content)) {
            const textContainer = document.querySelector('.about-text');
            if (textContainer) {
                textContainer.innerHTML = '';
                data.content.forEach(paragraph => {
                    if (typeof paragraph === 'string' && paragraph.trim()) {
                        const p = document.createElement('p');
                        p.textContent = paragraph;
                        textContainer.appendChild(p);
                    }
                });
            }
        }
        if (data && data.features && Array.isArray(data.features)) {
            const featuresContainer = document.querySelector('.about-features');
            if (featuresContainer) {
                featuresContainer.innerHTML = '';
                data.features.forEach(feature => {
                    if (feature && typeof feature.title === 'string' && feature.title.trim()) {
                        const featureDiv = document.createElement('div');
                        featureDiv.className = 'feature';
                        featureDiv.innerHTML = `
                            <div class="feature-icon">
                                <i class="${feature.icon || 'fas fa-star'}"></i>
                            </div>
                            <h3>${feature.title}</h3>
                            <p>${feature.description || ''}</p>
                        `;
                        featuresContainer.appendChild(featureDiv);
                    }
                });
            }
        }
    }

    updateProductsData(data) {
        console.log('Updating products data:', data);
        if (data && typeof data.title === 'string' && data.title.trim()) {
            const title = document.querySelector('#products .section-title');
            if (title) title.textContent = data.title;
        }
        if (data && typeof data.subtitle === 'string' && data.subtitle.trim()) {
            const subtitle = document.querySelector('#products .section-subtitle');
            if (subtitle) subtitle.textContent = data.subtitle;
        }
        if (data && data.categories && Array.isArray(data.categories)) {
            const grid = document.querySelector('.products-grid');
            if (grid) {
                grid.innerHTML = '';
                data.categories.forEach(category => {
                    if (category && typeof category.name === 'string' && category.name.trim()) {
                        const categoryDiv = document.createElement('div');
                        categoryDiv.className = 'product-category';
                        if (category.featured) {
                            categoryDiv.classList.add('featured');
                        }
                        categoryDiv.innerHTML = `
                            <div class="product-icon">
                                <i class="${category.icon || 'fas fa-box'}"></i>
                            </div>
                            <h3>${category.name}</h3>
                            <p>${category.description || ''}</p>
                        `;
                        grid.appendChild(categoryDiv);
                    }
                });
            }
        }
    }

    updateContactData(data) {
        console.log('Updating contact data:', data);
        if (data && typeof data.title === 'string' && data.title.trim()) {
            const title = document.querySelector('#contact .section-title');
            if (title) title.textContent = data.title;
        }
        if (data && typeof data.subtitle === 'string' && data.subtitle.trim()) {
            const subtitle = document.querySelector('#contact .section-subtitle');
            if (subtitle) subtitle.textContent = data.subtitle;
        }
        
        // Update contact items only if all required data is present and valid
        const contactInfo = document.querySelector('.contact-info');
        if (contactInfo && data && data.address && data.phones && data.email) {
            // Update address
            const addressP = contactInfo.querySelector('.contact-item:first-child .contact-details p');
            if (addressP && data.address.street && typeof data.address.street === 'string') {
                addressP.textContent = data.address.street;
            }
            
            // Update phones
            const phoneDetails = contactInfo.querySelector('.contact-item:nth-child(2) .contact-details');
            if (phoneDetails && data.phones && Array.isArray(data.phones)) {
                phoneDetails.innerHTML = '<h3>Τηλέφωνα</h3>';
                data.phones.forEach(phone => {
                    if (phone && phone.label && phone.number && typeof phone.label === 'string' && typeof phone.number === 'string') {
                        const p = document.createElement('p');
                        p.textContent = `${phone.label}: ${phone.number}`;
                        phoneDetails.appendChild(p);
                    }
                });
            }
            
            // Update email
            const emailP = contactInfo.querySelector('.contact-item:nth-child(3) .contact-details p');
            if (emailP && data.email && typeof data.email === 'string') emailP.textContent = data.email;
        }
        
        if (data && data.map_embed && typeof data.map_embed === 'string') {
            const iframe = document.querySelector('.map-container iframe');
            if (iframe) iframe.src = data.map_embed;
        }
    }

    updateNavigationData(data) {
        console.log('Updating navigation data:', data);
        if (data && data.items && Array.isArray(data.items)) {
            const navMenu = document.querySelector('.nav-menu');
            if (navMenu) {
                navMenu.innerHTML = '';
                data.items
                    .sort((a, b) => (a.order || 0) - (b.order || 0))
                    .forEach(item => {
                        if (item && item.text && item.link) {
                            const link = document.createElement('a');
                            link.href = item.link;
                            link.className = 'nav-link';
                            link.textContent = item.text;
                            navMenu.appendChild(link);
                        }
                    });
            }
        }
    }

    updateFooterData(data) {
        console.log('Updating footer data:', data);
        const footerBottom = document.querySelector('.footer-bottom p');
        if (footerBottom && data) {
            const copyright = data.copyright || '© 2025 Mentor Zografos | Με επιφύλαξη κάθε νόμιμου δικαιώματος.';
            const devName = data.developer_name || 'mianagn';
            const devLink = data.developer_link || 'https://mianagn.github.io';
            footerBottom.innerHTML = `${copyright} | Κατασκευή - Φιλοξενία: <a href="${devLink}">${devName}</a>`;
        }
    }

    updateSpecialOfferData(data) {
        console.log('Updating special offer data:', data);
        const popup = document.querySelector('#specialOfferPopup');
        if (!popup) return;
        
        if (!data || !data.enabled) {
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
