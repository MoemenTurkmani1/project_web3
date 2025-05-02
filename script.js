const cards = [
    {
      title: "Our vision",
      image: "https://mala3b4.odoo.com/web_editor/image_shape/website.s_three_columns_default_image_3/web_editor/solid/solid_blob_3.svg?c5=o-color-2",
      alt: "Our Vision",
      text: "Our goal is to provide a fun, engaging, and positive environment for athletes of all levels.",
      colorClass: "color2"
    },
    {
      title: "For every athlete",
      image: "https://mala3b4.odoo.com/web_editor/image_shape/website.s_three_columns_default_image_2/web_editor/composition/composition_organic_line.svg?c2=o-color-3",
      alt: "For Every Athlete",
      text: "All activities are designed to cater to each athlete’s individual goals. This approach will help you reach your full potential.",
      colorClass: "color1"
    },
    {
      title: "Open-door policy",
      image: "https://mala3b4.odoo.com/web_editor/image_shape/website.s_three_columns_default_image_1/web_editor/solid/solid_blob_1.svg?c2=o-color-1",
      alt: "Open Door Policy",
      text: "You are welcome to come and tour the complex and meet our team at any time convenient for you.",
      colorClass: "color2"
    }
  ];
  
  function renderCards(cardData, containerId) {
    const container = document.getElementById(containerId);
    if (!container || !Array.isArray(cardData)) return;
  
    cardData.forEach(card => {
      const column = document.createElement("div");
      column.className = "card-column";
  
      const cardEl = document.createElement("div");
      cardEl.className = "card";
  
      const figure = document.createElement("figure");
      const img = document.createElement("img");
      img.src = card.image;
      img.alt = card.alt || "Card image";
      img.onerror = () => { img.src = "https://via.placeholder.com/300x300?text=Image+Not+Found"; };
      figure.appendChild(img);
  
      const body = document.createElement("div");
      body.className = "card-body";
  
      const title = document.createElement("h5");
      title.className = "card-title";
      title.textContent = card.title;
  
      const hr = document.createElement("hr");
      hr.className = `card-separator ${card.colorClass}`;
  
      const text = document.createElement("p");
      text.className = "card-text";
      text.textContent = card.text;
  
      body.appendChild(title);
      body.appendChild(hr);
      body.appendChild(text);
  
      cardEl.appendChild(figure);
      cardEl.appendChild(body);
      column.appendChild(cardEl);
      container.appendChild(column);
    });
  }
  
  // Call the function
  renderCards(cards, "card-row");
  