import { DataTypes, QueryInterface } from 'sequelize';

export default {
  /**
   # ToDo: Create a migration that creates all tables for the following user stories

   For an example on how a UI for an api using this might look like, please try to book a show at https://in.bookmyshow.com/.
   To not introduce additional complexity, please consider only one cinema.

   Please list the tables that you would create including keys, foreign keys and attributes that are required by the user stories.

   ## User Stories

   **Movie exploration**
   * As a user I want to see which films can be watched and at what times
   * As a user I want to only see the shows which are not booked out

   **Show administration**
   * As a cinema owner I want to run different films at different times
   * As a cinema owner I want to run multiple films at the same time in different showrooms

   **Pricing**
   * As a cinema owner I want to get paid differently per show
   * As a cinema owner I want to give different seat types a percentage premium, for example 50 % more for vip seat

   **Seating**
   * As a user I want to book a seat
   * As a user I want to book a vip seat/couple seat/super vip/whatever
   * As a user I want to see which seats are still available
   * As a user I want to know where I'm sitting on my ticket
   * As a cinema owner I don't want to configure the seating for every show
   */
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  up: async (queryInterface: QueryInterface): Promise<void> => {
    // throw new Error('TODO: implement migration in task 4');
    await queryInterface.createTable('movies', {
      id: {
        type: DataTypes.INTEGER,
        allowNull: false,
        primaryKey: true,
        autoIncrement: true,
      },
      title: {
        type: DataTypes.STRING,
        allowNull: false,
      },
    });
  
    await queryInterface.createTable('shows', {
      id: {
        type: DataTypes.INTEGER,
        allowNull: false,
        primaryKey: true,
        autoIncrement: true,
      },
      movieId: {
        type: DataTypes.INTEGER,
        allowNull: false,
        references: {
          model: 'movies',
          key: 'id',
        },
      },
      startTime: {
        type: DataTypes.DATE,
        allowNull: false,
      },
      soldOut: {
        type: DataTypes.BOOLEAN,
        allowNull: false,
        defaultValue: false,
      },
    });
  
    await queryInterface.createTable('showrooms', {
      id: {
        type: DataTypes.INTEGER,
        allowNull: false,
        primaryKey: true,
        autoIncrement: true,
      },
      name: {
        type: DataTypes.STRING,
        allowNull: false,
      },
    });
  
    await queryInterface.createTable('showroom_shows', {
      id: {
        type: DataTypes.INTEGER,
        allowNull: false,
        primaryKey: true,
        autoIncrement: true,
      },
      showroomId: {
        type: DataTypes.INTEGER,
        allowNull: false,
        references: {
          model: 'showrooms',
          key: 'id',
        },
      },
      showId: {
        type: DataTypes.INTEGER,
        allowNull: false,
        references: {
          model: 'shows',
          key: 'id',
        },
      },
    });
  
    await queryInterface.createTable('pricing', {
      id: {
        type: DataTypes.INTEGER,
        allowNull: false,
        primaryKey: true,
        autoIncrement: true,
      },
      showId: {
        type: DataTypes.INTEGER,
        allowNull: false,
        references: {
          model: 'shows',
          key: 'id',
        },
      },
      price: {
        type: DataTypes.DECIMAL(10, 2),
        allowNull: false,
      },
    });
  
    await queryInterface.createTable('seat_types', {
      id: {
        type: DataTypes.INTEGER,
        allowNull: false,
        primaryKey: true,
        autoIncrement: true,
      },
      name: {
        type: DataTypes.STRING,
        allowNull: false,
      },
      premiumPercentage: {
        type: DataTypes.INTEGER,
        allowNull: false,
        defaultValue: 0,
      },
    });
  
    await queryInterface.createTable('seats', {
      id: {
        type: DataTypes.INTEGER,
        allowNull: false,
        primaryKey: true,
        autoIncrement: true,
      },
      showroomId: {
        type: DataTypes.INTEGER,
        allowNull: false,
        references: {
          model: 'showrooms',
          key: 'id',
        },
      },
      seatTypeId: {
        type: DataTypes.INTEGER,
        allowNull: false,
        references: {
          model: 'seat_types',
          key: 'id',
        },
      },
      row: {
        type: DataTypes.STRING,
        allowNull: false,
      },
      number: {
        type: DataTypes.INTEGER,
        allowNull: false,
      },
    });
    await queryInterface.createTable('bookings', {
      id: {
        allowNull: false,
        autoIncrement: true,
        primaryKey: true,
        type: DataTypes.INTEGER,
      },
      seatId: {
        allowNull: false,
        type: DataTypes.INTEGER,
        references: {
          model: 'seats',
          key: 'id',
        },
      },
      showId: {
        allowNull: false,
        type: DataTypes.INTEGER,
        references: {
          model: 'shows',
          key: 'id',
        },
      },
    });
  },

  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  down: async (queryInterface: QueryInterface) => {
    // do nothing
  },
};
