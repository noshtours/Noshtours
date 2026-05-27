// Breadcrumb Navigation Functionality
class BreadcrumbNav {
  constructor() {
      this.container = document.getElementById('breadcrumb-container');
          this.init();
            }

              init() {
                  if (!this.container) return;
                      this.generateBreadcrumbs();
                          this.updateSchema();
                            }

                              generateBreadcrumbs() {
                                  const path = window.location.pathname;
                                      const segments = path.split('/').filter(s => s);

                                          if (segments.length === 0) return;

                                              let breadcrumbHTML = '';
                                                  let currentPath = '';

                                                      segments.forEach((segment, index) => {
                                                            currentPath += '/' + segment;
                                                                  const label = this.formatLabel(segment);
                                                                        const isLast = index === segments.length - 1;

                                                                              if (!isLast) {
                                                                                      breadcrumbHTML += `
                                                                                                <li>
                                                                                                            <a href="${currentPath}">${label}</a>
                                                                                                                      </li>
                                                                                                                              `;
                                                                                                                                    } else {
                                                                                                                                            breadcrumbHTML += `
                                                                                                                                                      <li>
                                                                                                                                                                  <span>${label}</span>
                                                                                                                                                                            </li>
                                                                                                                                                                                    `;
                                                                                                                                                                                          }
                                                                                                                                                                                              });

                                                                                                                                                                                                  this.container.innerHTML = breadcrumbHTML;
                                                                                                                                                                                                    }

                                                                                                                                                                                                      formatLabel(segment) {
                                                                                                                                                                                                          return segment
                                                                                                                                                                                                                .split('-')
                                                                                                                                                                                                                      .map(word => word.charAt(0).toUpperCase() + word.slice(1))
                                                                                                                                                                                                                            .join(' ');
                                                                                                                                                                                                                              }

                                                                                                                                                                                                                                updateSchema() {
                                                                                                                                                                                                                                    const path = window.location.pathname;
                                                                                                                                                                                                                                        const segments = path.split('/').filter(s => s);
                                                                                                                                                                                                                                            const breadcrumbList = [{
                                                                                                                                                                                                                                                  "@type": "ListItem",
                                                                                                                                                                                                                                                        "position": 1,
                                                                                                                                                                                                                                                              "name": "Home",
                                                                                                                                                                                                                                                                    "item": window.location.origin
                                                                                                                                                                                                                                                                        }];

                                                                                                                                                                                                                                                                            let currentPath = '';
                                                                                                                                                                                                                                                                                segments.forEach((segment, index) => {
                                                                                                                                                                                                                                                                                      currentPath += '/' + segment;
                                                                                                                                                                                                                                                                                            breadcrumbList.push({
                                                                                                                                                                                                                                                                                                    "@type": "ListItem",
                                                                                                                                                                                                                                                                                                            "position": index + 2,
                                                                                                                                                                                                                                                                                                                    "name": this.formatLabel(segment),
                                                                                                                                                                                                                                                                                                                            "item": window.location.origin + currentPath
                                                                                                                                                                                                                                                                                                                                  });
                                                                                                                                                                                                                                                                                                                                      });

                                                                                                                                                                                                                                                                                                                                          const script = document.createElement('script');
                                                                                                                                                                                                                                                                                                                                              script.type = 'application/ld+json';
                                                                                                                                                                                                                                                                                                                                                  script.textContent = JSON.stringify({
                                                                                                                                                                                                                                                                                                                                                        "@context": "https://schema.org",
                                                                                                                                                                                                                                                                                                                                                              "@type": "BreadcrumbList",
                                                                                                                                                                                                                                                                                                                                                                    "itemListElement": breadcrumbList
                                                                                                                                                                                                                                                                                                                                                                        });

                                                                                                                                                                                                                                                                                                                                                                            document.head.appendChild(script);
                                                                                                                                                                                                                                                                                                                                                                              }
                                                                                                                                                                                                                                                                                                                                                                              }

                                                                                                                                                                                                                                                                                                                                                                              // Initialize breadcrumbs when DOM is ready
                                                                                                                                                                                                                                                                                                                                                                              if (document.readyState === 'loading') {
                                                                                                                                                                                                                                                                                                                                                                                document.addEventListener('DOMContentLoaded', () => {
                                                                                                                                                                                                                                                                                                                                                                                    new BreadcrumbNav();
                                                                                                                                                                                                                                                                                                                                                                                      });
                                                                                                                                                                                                                                                                                                                                                                                      } else {
                                                                                                                                                                                                                                                                                                                                                                                        new BreadcrumbNav();
                                                                                                                                                                                                                                                                                                                                                                                        }