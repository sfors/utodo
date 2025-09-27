# TODO List application

## Technical requirements
- Language: TypeScript
- Framework: React
- Backend: Node

## User Stories

### Will be quick to implement
- [x] I as a user can create to-do items, such as a grocery list.
- [ ] I as another user can collaborate in real-time with user - so that we can (for example) edit our family shopping list together.
- [x] I as a user can mark to-do items as "done" - so that I can avoid clutter and focus on things that are still pending.
- [x] I as a user can filter the to-do list and view items that were marked as done - so that I can retrospect on my prior progress.
- [ ] I as a user can add sub-tasks to my to-do items - so that I could make logical groups of tasks and see their overall progress.
- [ ] I as a user can specify cost/price for a task or a subtask - so that I can track my expenses / project cost.
- [ ] I as a user can see the sum of the subtasks aggregated in the parent task - so that in my shopping list I can see what contributes to the overall sum.  
For example I can have a task called "Salad", where I'd add all ingredients as sub-tasks, and would see how much a salad costs on my shopping list.
- [ ] I as a user can make infinite nested levels of subtasks.
- [ ] I as a user can add sub-descriptions of tasks in Markdown and view them as rich text while I'm not editing the descriptions.
- [ ] I as a user can create multiple to-do lists where each list has its unique URL that I can share with my friends - so that I could have separate to-do lists for my groceries and work related tasks.
- [ ] In addition to regular to-do tasks, I as a user can add "special" typed to-do items, that will have custom style and some required fields:  
  - "work-task", which has a required field "deadline" - which is a date
  - "food" that has fields:
    - required: "carbohydrate", "fat", "protein" (each specified in g/100g)
    - optional: "picture" a URL to an image used to render this item

- [ ] I as a user can change the order of tasks via drag & drop
- [ ] I as a user can move/convert subtasks to tasks via drag & drop
- [x] I as a user can be sure that my todos will be persisted so that important information is not lost when server restarts
- [ ] I as an owner/creator of a certain to-do list can freeze/unfreeze a to-do list I've created to avoid other users from mutating it

### Will require significant work
- [ ] I as a user can keep editing the list even when I lose internet connection, and can expect it to sync up with BE as I regain connection
- [ ] I as a user can see the cursor and/or selection of another-user as he selects/types when he is editing text - so that we can discuss focused words during our online call.


## User stories that I will not attempt

- [ ] I as a user can use my VR goggles to edit/browse multiple to-do lists in parallel in 3D space so that I can feel ultra-productive  
*I will not be able to achieve this and the things above in the specified time, it would be fun though.*

## Initial thoughts

Regarding Markdown, I will probably use some library to render markdown. I don't feel that it would be that interesting to implement it myself.

The most interesting part is definitely handling the combination of offline editing and real time collaboration.

Offline functionality can be done with web workers, and it would be trivial if multi-user collaboration was not also a thing.

I will have to figure out a good way to model changes so that they can be merged correctly.

And merge conflicts are inevitable, there needs to be a way to handle them.

For simple values like strings and numbers, overwriting is probably the way to go.

Markdown descriptions could be chunked by line, then multiple edits to the same line would overwrite each other.

This could be a good enough solution. To make it more complete you would probably have to represent the description as some kind of tree structure.

Updates from the client would be sent via websocket to the server. The server would then broadcast updates via websocket to other connected clients.

I think I will ignore merge issues for now and tackle that later.

Every object should have an id and every connected user will be notified when an id has been updated so that the client can refetch that resource.

If a user is highlighting something, that will be sent to the server via websocket and other users interested in this highlighting will be notified so that it can be displayed.
Cursor position would be the same, always sent via websocket so that it can be broadcast.

## Structure

### High level overview of the required objects in this system

--- 

Item
id, listId, parentId, index, name, description?, type?, customFields?

listId - reference to a todo list containing this item  
parentId - reference to parentItem, not set if item in root list  
index - index used for ordering of items  
name - Text describing what needs to be done  
description - Optional, Markdown with detailed description of this item  
typeId - Optional, Set if this is a typed item, reference to the type of this item  
customFields - Optional, if this is a typed item, these are the custom fields  

---

Todo List
id, ownerId, frozen

ownerId - reference to the owner user id of this list
frozen - if the list is frozen or not

---

User
id, email, firstName, lastName

---

Member
listId, userId

---

ItemUpdate

id
changes: Change[]

---

Change

key, value

---