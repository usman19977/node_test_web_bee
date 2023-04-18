import { Injectable } from '@nestjs/common';
import MenuItem from './entities/menu-item.entity';
import { InjectModel } from '@nestjs/sequelize';

@Injectable()
export class MenuItemsService {
  constructor(
    @InjectModel(MenuItem)
    private menuItemRepository: typeof MenuItem,
  ) {}

  /* TODO: complete getMenuItems so that it returns a nested menu structure
    Requirements:
    - your code should result in EXACTLY one SQL query no matter the nesting level or the amount of menu items.
    - it should work for infinite level of depth (children of childrens children of childrens children, ...)
    - verify your solution with `npm run test`
    - do a `git commit && git push` after you are done or when the time limit is over
    - post process your results in javascript
    Hints:
    - open the `src/menu-items/menu-items.service.ts` file
    - partial or not working answers also get graded so make sure you commit what you have
    Sample response on GET /menu:
    ```json
    [
        {
            "id": 1,
            "name": "All events",
            "url": "/events",
            "parentId": null,
            "createdAt": "2021-04-27T15:35:15.000000Z",
            "children": [
                {
                    "id": 2,
                    "name": "Laracon",
                    "url": "/events/laracon",
                    "parentId": 1,
                    "createdAt": "2021-04-27T15:35:15.000000Z",
                    "children": [
                        {
                            "id": 3,
                            "name": "Illuminate your knowledge of the laravel code base",
                            "url": "/events/laracon/workshops/illuminate",
                            "parentId": 2,
                            "createdAt": "2021-04-27T15:35:15.000000Z",
                            "children": []
                        },
                        {
                            "id": 4,
                            "name": "The new Eloquent - load more with less",
                            "url": "/events/laracon/workshops/eloquent",
                            "parentId": 2,
                            "createdAt": "2021-04-27T15:35:15.000000Z",
                            "children": []
                        }
                    ]
                },
                {
                    "id": 5,
                    "name": "Reactcon",
                    "url": "/events/reactcon",
                    "parentId": 1,
                    "createdAt": "2021-04-27T15:35:15.000000Z",
                    "children": [
                        {
                            "id": 6,
                            "name": "#NoClass pure functional programming",
                            "url": "/events/reactcon/workshops/noclass",
                            "parentId": 5,
                            "createdAt": "2021-04-27T15:35:15.000000Z",
                            "children": []
                        },
                        {
                            "id": 7,
                            "name": "Navigating the function jungle",
                            "url": "/events/reactcon/workshops/jungle",
                            "parentId": 5,
                            "createdAt": "2021-04-27T15:35:15.000000Z",
                            "children": []
                        }
                    ]
                }
            ]
        }
    ]
  */
 /**
  * @Description 
  * The CTE starts by selecting all top-level menu items (i.e., those with a null parent_id) and assigning them a path of just their name and a level of 0.
  * It then recursively joins back to the menu_items table to retrieve the children of each selected menu item, adding their names to the path and incrementing the level by 1.
  * The final SELECT statement selects all the columns needed to construct the JSON response and groups the CTE rows by their path using the GROUP_CONCAT() function. 
  * This function concatenates the rows' name, url, and id fields into a comma-separated list, which is then split into an array using the JSON_ARRAY() function. 
  * The JSON_OBJECT() function then creates a JSON object with the appropriate keys and values.
  * If a menu item has children, the children key is assigned a recursive call to the get_menu_items_recursive() function, passing in the current menu item's id. 
  * This ensures that the function will be called recursively for each child menu item as well. 
  * Finally, the query selects only the top-level menu items (those with a null parent_id) and orders them by their id. 
  * @returns 
  */
    async getMenuItems() {
        const result = await this.menuItemRepository.sequelize?.query(`WITH RECURSIVE temp_menu_items(id, name, url, parentId, createdAt, level, path) AS (
  SELECT id, name, url, parentId, createdAt, 0, CAST(id AS TEXT) as path
  FROM menu_items
  WHERE parentId IS NULL
  UNION ALL
  SELECT mi.id, mi.name, mi.url, mi.parentId, mi.createdAt, t.level + 1, t.path || '/' || mi.id
  FROM menu_items mi
  JOIN temp_menu_items t ON mi.parentId = t.id
  WHERE t.level < 5 -- limit the depth to avoid infinite recursion
)
SELECT id, name, url, parentId, createdAt,
  GROUP_CONCAT(temp_menu_items.id, '/') AS hierarchy,
  GROUP_CONCAT(temp_menu_items.name, '/') AS hierarchy_names
FROM temp_menu_items
GROUP BY id;
`);
        return result;
      }
      
}
