# Anatoly Yani World

## Overview
Anatoly Yani World is a website dedicated to life and poetry of this author. It is built using the Pelican static site generator, featuring a custom theme and plugin.

## Installation

### Prerequisites
- Python 3.x


### Steps
1. Clone the repository

2. Install the dependencies:
   ```bash
   pip install pelican markdown
   ```

3. Generate the website:
   ```bash
   pelican content
   ```

## Usage
To preview the website locally:
```bash
pelican --listen
```
Open your web browser and go to `http://localhost:8000` to view the website.

## Directory Structure
```
content/
├── images/
├── pages/
├── poems/
├── quotes.json
└── translations/

themes/yani-theme/
├── README.md
├── static/
│   ├── css/
│   ├── images/
│   └── js/
└── templates/

plugins/
└── pelican_poetic.py
```

## Configuration
Configure Pelican settings in the `pelicanconf.py` file.

## Customization
To customize the theme, modify the files in the `themes/yani-theme` directory. Update styles in the `static/css` directory or change templates in the `templates` directory.

## Deployment
Deploy the website to a hosting service such as GitHub Pages, Netlify, or Vercel. Follow the hosting service's instructions for deploying a static site.
