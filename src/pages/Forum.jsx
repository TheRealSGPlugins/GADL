import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { motion } from "framer-motion";
import { Eye, MessageSquare } from "lucide-react";
import Navbar from "../components/Navbar";
import { base44 } from "@/api/base44Client";
import { useAuth } from "@/lib/AuthContext";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { toast } from "sonner";

const tagColors = {
  Python: "bg-chart-4/20 text-chart-4",
  Lua: "bg-accent/15 text-accent",
  MemoryOffset: "bg-chart-2/15 text-chart-2",
  General: "bg-muted text-muted-foreground",
  Help: "bg-destructive/15 text-destructive",
  Showcase: "bg-chart-2/15 text-chart-2",
};

function TopicCard({ topic, onClick }) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      onClick={onClick}
      className="group cursor-pointer bg-card/60 backdrop-blur-xl border border-border/50 rounded-2xl p-5 hover:border-accent/30 hover:shadow-lg hover:shadow-accent/5 transition-all duration-300 hover:scale-[1.01]"
    >
      <div className="flex items-start gap-4">
        <div className="w-10 h-10 rounded-full bg-accent/10 flex items-center justify-center text-accent font-bold text-sm shrink-0">
          {(topic.author_name || "A")[0].toUpperCase()}
        </div>
        <div className="flex-1 min-w-0">
          <h3 className="font-heading font-bold text-foreground group-hover:text-accent transition-colors truncate">
            {topic.title}
          </h3>
          <p className="text-sm text-muted-foreground mt-1 line-clamp-2 leading-relaxed">
            {topic.body}
          </p>
          <div className="flex items-center gap-2 mt-3 flex-wrap">
            {(topic.tags || []).map((tag) => (
              <span
                key={tag}
                className={`text-xs font-medium px-2.5 py-0.5 rounded-lg ${tagColors[tag] || tagColors.General}`}
              >
                #{tag}
              </span>
            ))}
            <span className="text-xs text-muted-foreground ml-auto flex items-center gap-3">
              <span className="flex items-center gap-1">
                <MessageSquare className="w-3.5 h-3.5" />
                {topic.replies_count || 0}
              </span>
              <span className="flex items-center gap-1">
                <Eye className="w-3.5 h-3.5" />
                {topic.views_count || 0}
              </span>
            </span>
          </div>
        </div>
      </div>
    </motion.div>
  );
}

export default function Forum() {
  const navigate = useNavigate();
  const { user } = useAuth();
  const [topics, setTopics] = useState([]);
  const [loading, setLoading] = useState(true);
  const [title, setTitle] = useState("");
  const [body, setBody] = useState("");
  const [authorName, setAuthorName] = useState("");
  const [tagInput, setTagInput] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);

  useEffect(() => {
    loadTopics();
  }, []);

  const loadTopics = async () => {
    setLoading(true);
    const data = await base44.entities.ForumTopic.list("-created_date", 50);
    setTopics(data);
    setLoading(false);
  };

  const resolvedAuthorName =
    user?.full_name || user?.email?.split("@")[0] || authorName.trim() || "Anonymous";

  const handleCreateTopic = async (e) => {
    e.preventDefault();
    if (!title.trim() || !body.trim()) {
      toast.error("Title and message are required.");
      return;
    }

    setIsSubmitting(true);
    try {
      const tags = tagInput
        .split(",")
        .map((tag) => tag.trim())
        .filter(Boolean);

      const createdTopic = await base44.entities.ForumTopic.create({
        title: title.trim(),
        body: body.trim(),
        tags,
        author_name: resolvedAuthorName,
        replies_count: 0,
        views_count: 0,
      });

      setTitle("");
      setBody("");
      setAuthorName("");
      setTagInput("");
      await loadTopics();
      toast.success("Topic posted.");
      navigate(`/forum/${createdTopic.id}`);
    } catch (error) {
      toast.error(error?.message || "Failed to post topic.");
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="min-h-screen bg-background font-body">
      <Navbar />
      <div className="pt-24 pb-24 px-6 max-w-4xl mx-auto">
        <div className="flex items-end justify-between mb-8">
          <div>
            <h1 className="font-heading text-3xl md:text-4xl font-extrabold tracking-tight text-foreground">
              Community Forum
            </h1>
            <p className="mt-2 text-muted-foreground">
              Ask questions, share knowledge, and connect with developers.
            </p>
          </div>
        </div>

        <form
          onSubmit={handleCreateTopic}
          className="bg-card/60 backdrop-blur-xl border border-border/50 rounded-3xl p-6 md:p-8 mb-8 space-y-4"
        >
          <div>
            <h2 className="font-heading text-xl font-bold text-foreground">Start a discussion</h2>
            <p className="text-sm text-muted-foreground mt-1">
              Post a question, a win, or a problem you want help with.
            </p>
          </div>

          {!user && (
            <Input
              value={authorName}
              onChange={(e) => setAuthorName(e.target.value)}
              placeholder="Your name (optional)"
              className="h-11"
            />
          )}

          <Input
            value={title}
            onChange={(e) => setTitle(e.target.value)}
            placeholder="Topic title"
            className="h-11"
          />

          <Textarea
            value={body}
            onChange={(e) => setBody(e.target.value)}
            placeholder="Write your post..."
            className="min-h-32 resize-y"
          />

          <Input
            value={tagInput}
            onChange={(e) => setTagInput(e.target.value)}
            placeholder="Tags separated by commas, e.g. Lua, Help"
            className="h-11"
          />

          <div className="flex items-center justify-between gap-4 flex-wrap">
            <p className="text-sm text-muted-foreground">
              Posting as <span className="text-foreground font-medium">{resolvedAuthorName}</span>
            </p>
            <Button type="submit" disabled={isSubmitting}>
              {isSubmitting ? "Posting..." : "Post Topic"}
            </Button>
          </div>
        </form>

        <div className="space-y-3">
          {loading ? (
            <div className="flex justify-center py-20">
              <div className="w-7 h-7 border-3 border-muted border-t-accent rounded-full animate-spin" />
            </div>
          ) : topics.length === 0 ? (
            <div className="text-center py-20 text-muted-foreground">
              <MessageSquare className="w-10 h-10 mx-auto mb-3 opacity-40" />
              <p className="text-lg font-medium">No topics yet</p>
              <p className="text-sm mt-1">Be the first to start a discussion!</p>
            </div>
          ) : (
            topics.map((topic) => (
              <TopicCard
                key={topic.id}
                topic={topic}
                onClick={() => navigate(`/forum/${topic.id}`)}
              />
            ))
          )}
        </div>
      </div>
    </div>
  );
}
