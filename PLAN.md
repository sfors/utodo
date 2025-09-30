## Things I would like to complete before submitting

- [x] Join/unjoin other user list
- [ ] Add subtasks
- [ ] Delete owned lists
- [ ] See who is editing list with me
- [ ] Drag and drop
- [ ] Finish user handling (email, login-sessions)
- [ ] LISTEN/NOTIFY via db to enable scaling
- [ ] Freeze
- [ ] Consolidate styling


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

