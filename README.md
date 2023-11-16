# Meetup Project

This is the Meetup project repository. It's designed to help users connect with others for events and activities.

## Getting Started

Follow these steps to set up and run the project on your local machine.

### Prerequisites

- [Node.js](https://nodejs.org/) installed on your machine.
- [MongoDB](https://www.mongodb.com/try/download/community) installed on your machine.

### Installation

1. **Clone the repository:**

    ```bash
    git clone https://github.com/Ryanslep/Meetup.git
    ```

2. **Change into the project directory:**

    ```bash
    cd Meetup
    ```

3. **Install dependencies:**

    ```bash
    npm install
    ```

4. **Create a `.env` file in the project root and add the following content:**

    ```env
    # .env
    DBHost=localhost
    PORT=3000
    ```

    Replace `<your_secret_key>` with a secret key for JWT.

5. **Change into the client directory:**

    ```bash
    cd client
    ```

6. **Install client dependencies:**

    ```bash
    npm install
    ```

7. **Run your MongoDB server.**

    Make sure your MongoDB server is running locally.

8. **Run the project:**

    ```bash
    npm run web
    ```

9. **Your default web browser should open, and you can start using the Meetup application.**

## Contributing

If you'd like to contribute to the project, please follow the [contribution guidelines](CONTRIBUTING.md).

## License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.
