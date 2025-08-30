# Excel Grid

A modern, interactive, Excel-like grid built with React.  
Features include keyboard navigation, sorting, filtering, dynamic row/column management, and a clean UI.

## Features

- **Excel-like grid** with editable cells
- **Customizable rows and columns** (set from UI)
- **Column (A, B, C...) and row (1, 2, 3...) headers**
- **Full keyboard navigation** (Tab, Shift+Tab, Arrow keys)
- **Highlight** the focused row and column header
- **Sorting** (ascending/descending) per column
- **Filtering** by column and value
- **Add/Delete rows and columns** anywhere (via right-click context menu)
- **Responsive UI** with dynamic cell sizing
- **Grey headers** for rows and columns
- **White background for cell inputs**
- **No external dependencies** except React

## Getting Started

### 1. Clone the repository

```sh
git clone https://github.com/vaibhavtaywade/Excel_Grid.git
cd Excel_Grid
```

### 2. Install dependencies

```sh
npm install
```

### 3. Run the development server

```sh
npm run dev
```

Open [http://localhost:5173](http://localhost:5173) (or the port shown in your terminal) to view the app.

## Usage

- **Edit cells:** Click or use keyboard to focus, then type.
- **Navigate:** Use Tab, Shift+Tab, and Arrow keys.
- **Sort:** Click ▲ or ▼ in any column header.
- **Filter:** Use the filter controls above the grid.
- **Add/Delete rows/columns:** Right-click on a row/column header or cell for options.
- **Resize grid:** Change the number of rows/columns using the controls.

## Project Structure

```
src/
  App.jsx
  index.jsx
  components/
    ExcelGrid.jsx
  styles/
    ExcelGrid.css
    global.css
index.html
```

## Customization

- **Max grid size:** For performance, you can set a maximum number of rows/columns in `App.jsx`.
- **Styling:** Adjust colors and layout in `src/styles/ExcelGrid.css` and `src/styles/global.css`.
