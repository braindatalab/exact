## 🐳 Getting Started with Dev Container

To work with this project inside a Dev Container, you’ll need the following:

- [Visual Studio Code](https://code.visualstudio.com/)
- [Dev Containers Extension](https://marketplace.visualstudio.com/items?itemName=ms-vscode-remote.remote-containers)

---

### ✅ Setup Steps

1. **Open the project folder** in VS Code.
2. Open the Command Palette via `F1` or `Ctrl+Shift+P` and run:  
   `Dev Containers: Reopen in Container`

   > 📦 The first launch may take a few minutes to build the container image. Future launches will be much faster due to caching.

---

### 🔍 Tips for First-Time Users

#### 1. Install the Dev Containers Extension  
Search for `Dev Containers` in the Extensions panel on the left:

![Search Dev Containers](https://github.com/user-attachments/assets/e6914859-8523-46b7-a9cb-b526f6d15840)

Select and install it:

![Install Dev Containers](https://github.com/user-attachments/assets/cb90ee01-67b4-4ee0-afa7-dabc08df7ba4)

#### 2. Open the Project in a Container  
Click the **bottom-left corner** of VS Code (green/blue corner icon):

![Open Dev Container](https://github.com/user-attachments/assets/a43b5eef-877b-4b03-bab6-383884c7d135)

Choose **“Reopen in Container”**:

![Reopen in Container](https://github.com/user-attachments/assets/d3229486-919b-42f8-a28e-a28420c7f678)

Alternatively, this popup might appear automatically — it does the same:

![Popup Reopen Prompt](https://github.com/user-attachments/assets/b10fbc26-c7ae-4b7b-8bc1-d49c473113d4)

#### 3. Closing the Container  
Use the same menu to **close the Dev Container**:

![Close Container Menu](https://github.com/user-attachments/assets/0af4d660-7c9a-4a89-a7d4-1e4dfa0bf74a)  
![Close Container Action](https://github.com/user-attachments/assets/7e945713-ed2a-40bb-bbd5-67b1407c4994)

---

### ⚠️ Git Best Practices

The container mounts your local project folder, so **any changes inside the container are saved outside as well**.

> 🚫 **Do not commit or push from inside the container!**  
> It may include unnecessary Docker paths or extra files.  
> ✅ Always commit/push from **outside** the container.

---

### 🔁 After Making Changes

If you change project-level config or `devcontainer.json`, make sure to:

1. Close the container.
2. Reopen the project from your local folder (not from the container directly).
3. Then choose “Reopen in Container” again.

![Reopen Properly](https://github.com/user-attachments/assets/00f59627-3394-471b-a65f-0606ea505107)

---

Happy coding! 🚀
