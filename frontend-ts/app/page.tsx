import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import PingCard from "./ping/actions/ping";
import CreateMovieCard from "./movies/actions/create";
import RetrieveMovieCard from "./movies/actions/retrive";
import DeleteMovieCard from "./movies/actions/delete";
import UpdateMovieCard from "./movies/actions/update";
import ListByActorCard from "./movies/actions/listByActor";
import ListByGenreCard from "./movies/actions/listByGenre";

export default function Home() {
  return (
    <div className="flex flex-col gap-4 justify-center w-full">
      <h1 className="text-4xl font-bold">Filmes Legais!</h1>
      <Tabs defaultValue="ping" className="w-full">
        <TabsList>
          <TabsTrigger value="ping">Ping</TabsTrigger>
          <TabsTrigger value="create">Criar</TabsTrigger>
          <TabsTrigger value="retrive">Buscar</TabsTrigger>
          <TabsTrigger value="update">Atualizar</TabsTrigger>
          <TabsTrigger value="delete">Deletar</TabsTrigger>
          <TabsTrigger value="listByActor">Listar por ator</TabsTrigger>
          <TabsTrigger value="listByGenre">Listar por gênero</TabsTrigger>
        </TabsList>
        <TabsContent value="ping">
          <PingCard />
        </TabsContent>
        <TabsContent value="create">
          <CreateMovieCard />
        </TabsContent>
        <TabsContent value="retrive">
          <RetrieveMovieCard />
        </TabsContent>
        <TabsContent value="update">
          <UpdateMovieCard />
        </TabsContent>
        <TabsContent value="delete">
          <DeleteMovieCard />
        </TabsContent>
        <TabsContent value="listByActor">
          <ListByActorCard />
        </TabsContent>
        <TabsContent value="listByGenre">
          <ListByGenreCard />
        </TabsContent>
      </Tabs>
    </div>
  );
}
