import { Router } from "express";
import { initAuthRoutes } from "./auth.routes";
import { initBookmarkRoutes } from "./bookmarks.routes";
import { initGroupsRoutes } from "./groups.routes";
import { initListsRoutes } from "./lists.routes";
import { initPostRoutes } from "./posts.routes";
import { initUserRoutes } from "./users.routes";
import { UserService } from "../services/user.service";
import { UserRepository } from "../repositories/users";
import { FollowerRepository } from "../repositories/followers";
import { AuthService } from "../services/auth.service";
import { PostService } from "../services/post.service";
import { PostRepository } from "../repositories/posts";
import { LikeRepository } from "../repositories/likes";
import { BookmarkService } from "../services/bookmark.service";
import { BookmarkRepository } from "../repositories/bookmarks";
import { ListService } from "../services/list.service";
import { ListRepository } from "../repositories/lists";
import { ListMemberRepository } from "../repositories/list-member";
import { ListFollowerRepository } from "../repositories/list-followers";
import { GroupService } from "../services/group.service";
import { GroupRepository } from "../repositories/groups";
import { GroupMemberRepository } from "../repositories/group-member";
import { JoinRequestRepository } from "../repositories/join-requests";

export const initRouting = (): Router => {
    const router = Router();

    const userRepo = new UserRepository();
    const followRepo = new FollowerRepository();
    const postRepo = new PostRepository();
    const likeRepo = new LikeRepository();
    const bookmarkRepo = new BookmarkRepository();
    const listRepo = new ListRepository();
    const listMemberRepo = new ListMemberRepository();
    const listFollowerRepo = new ListFollowerRepository();
    const groupRepo = new GroupRepository();
    const groupMemberRepo = new GroupMemberRepository();
    const joinRequestRepo = new JoinRequestRepository();

    const userService = new UserService(userRepo, followRepo);
    const authService = new AuthService(userRepo);
    const postService = new PostService(postRepo, userRepo, likeRepo);
    const bookmarkService = new BookmarkService(bookmarkRepo, postRepo);
    const listService = new ListService(listRepo, listMemberRepo, userRepo, listFollowerRepo);
    const groupService = new GroupService(groupRepo, groupMemberRepo, joinRequestRepo, userRepo, postRepo);

    router.use("/auth", initAuthRoutes(authService));
    router.use("/bookmarks", initBookmarkRoutes(bookmarkService, userService));
    router.use("/groups", initGroupsRoutes(groupService, userService));
    router.use("/lists", initListsRoutes(listService, userService));
    router.use("/posts", initPostRoutes(postService, userService));
    router.use("/users", initUserRoutes(userService, authService, postService));

    return router;
}
