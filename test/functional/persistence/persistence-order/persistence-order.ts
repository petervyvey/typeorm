import "reflect-metadata";
import {createTestingConnections, closeTestingConnections, reloadTestingDatabases} from "../../../utils/test-utils";
import {Connection} from "../../../../src/connection/Connection";
import {Post} from "./entity/Post";
import {Category} from "./entity/Category";

describe("persistence > order of persistence execution operations", () => {

    describe("should throw exception when non-resolvable circular relations found", function() {

        it("should throw CircularRelationsError", () => createTestingConnections({
            entities: [__dirname + "/entity/*{.js,.ts}"],
            schemaCreate: true,
            dropSchemaOnConnection: true,
        }).should.be.rejected); // CircularRelationsError

    });

    describe.skip("should persist all entities in correct order", function() {

        let connections: Connection[];
        before(async () => connections = await createTestingConnections({
            entities: [__dirname + "/entity/*{.js,.ts}"],
            schemaCreate: true,
            dropSchemaOnConnection: true,
        }));
        beforeEach(() => reloadTestingDatabases(connections));
        after(() => closeTestingConnections(connections));
        it("", () => Promise.all(connections.map(async connection => {

            // create first category and post and save them
            const category1 = new Category();
            category1.name = "Category saved by cascades #1";

            const post1 = new Post();
            post1.title = "Hello Post #1";
            post1.category = category1;

            await connection.entityManager.persist(post1);

            // now check
            /*const posts = await connection.entityManager.find(Post, {
             alias: "post",
             innerJoinAndSelect: {
             category: "post.category"
             },
             orderBy: {
             "post.id": "ASC"
             }
             });

             posts.should.be.eql([{
             id: 1,
             title: "Hello Post #1",
             category: {
             id: 1,
             name: "Category saved by cascades #1"
             }
             }, {
             id: 2,
             title: "Hello Post #2",
             category: {
             id: 2,
             name: "Category saved by cascades #2"
             }
             }]);*/
        })));
    });



});
