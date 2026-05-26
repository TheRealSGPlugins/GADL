import { useEffect, useState } from "react";
import { Link, useParams } from "react-router-dom";
import { motion } from "framer-motion";
import { ArrowLeft, Eye, MessageSquare, Send } from "lucide-react";
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

export default function ForumTopicDetail() {
  const { topicId } = useParams();
  const { user } = useAuth();
  const [topic, setTopic] = useState(null);
  const [replies, setReplies] = useState([]);
  const [loading, setLoading] = useState(true);
  const [replyBody, setReplyBody] = useState("");
  const [replyAuthorName, setReplyAuthorName] = useState("");
  const [isSubmittingReply, setIsSubmittingReply] = useState(false);

  useEffect(() => {
    loadData();
  }, [topicId]);

  const loadData = async () => {
    setLoading(true);
    try {
      const [loadedTopic, loadedReplies] = await Promise.all([
        base44.entities.ForumTopic.get(topicId),
        base44.entities.ForumReply.filter({ topic_id: topicId }, "created_date", 100),
      ]);
      setTopic(loadedTopic);
      setReplies(loadedReplies);
      base44.entities.ForumTopic.update(topicId, {
        views_count: (loadedTopic.views_count || 0) + 1,
      }).catch(() => {});
    } catch (error) {
      setTopic(null);
      setReplies([]);
      toast.error(error?.message || "Failed to load topic.");
    } finally {
      setLoading(false);
    }
  };

  const resolvedAuthorName =
    user?.full_name || user?.email?.split("@")[0] || replyAuthorName.trim() || "Anonymous";

  const handleReplySubmit = async (e) => {
    e.preventDefault();
    if (!replyBody.trim()) {
      toast.error("Reply message is required.");
      return;
    }

    setIsSubmittingReply(true);
    try {
      await base44.entities.ForumReply.create({
        topic_id: topicId,
        body: replyBody.trim(),
        author_name: resolvedAuthorName,
      });

      await base44.entities.ForumTopic.update(topicId, {
        replies_count: (topic?.replies_count || 0) + 1,
      });

      setReplyBody("");
      setReplyAuthorName("");
      await loadData();
      toast.success("Reply posted.");
    } catch (error) {
      toast.error(error?.message || "Failed to post reply.");
    } finally {
      setIsSubmittingReply(false);
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center">
        <div className="w-7 h-7 border-2 border-muted border-t-accent rounded-full animate-spin" />
      </div>
    );
  }

  if (!topic) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center text-muted-foreground">
        Topic not found.
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-background font-body">
      <Navbar />
      <div className="pt-24 pb-16 px-6 max-w-3xl mx-auto">
        <Link
          to="/forum"
          className="inline-flex items-center gap-2 text-sm text-muted-foreground hover:text-accent transition-colors mb-6"
        >
          <ArrowLeft className="w-4 h-4" /> Back to Forum
        </Link>

        <motion.div
          initial={{ opacity: 0, y: 12 }}
          animate={{ opacity: 1, y: 0 }}
          className="bg-card/60 backdrop-blur-xl border border-border/50 rounded-3xl p-6 md:p-8 mb-6"
        >
          <div className="flex items-center gap-3 mb-4">
            <div className="w-10 h-10 rounded-full bg-accent/10 flex items-center justify-center text-accent font-bold text-sm shrink-0">
              {(topic.author_name || "A")[0].toUpperCase()}
            </div>
            <div>
              <p className="text-sm font-semibold text-foreground">{topic.author_name || "Anonymous"}</p>
              <p className="text-xs text-muted-foreground">
                {new Date(topic.created_date).toLocaleDateString("en-US", {
                  month: "short",
                  day: "numeric",
                  year: "numeric",
                })}
              </p>
            </div>
            <div className="ml-auto flex items-center gap-4 text-xs text-muted-foreground">
              <span className="flex items-center gap-1">
                <MessageSquare className="w-3.5 h-3.5" />
                {replies.length}
              </span>
              <span className="flex items-center gap-1">
                <Eye className="w-3.5 h-3.5" />
                {topic.views_count || 0}
              </span>
            </div>
          </div>

          <h1 className="font-heading text-2xl md:text-3xl font-extrabold tracking-tight text-foreground mb-3">
            {topic.title}
          </h1>
          <p className="text-muted-foreground leading-relaxed">{topic.body}</p>

          {topic.tags?.length > 0 && (
            <div className="flex gap-2 flex-wrap mt-4">
              {topic.tags.map((tag) => (
                <span
                  key={tag}
                  className={`text-xs font-medium px-2.5 py-0.5 rounded-lg ${tagColors[tag] || "bg-muted text-muted-foreground"}`}
                >
                  #{tag}
                </span>
              ))}
            </div>
          )}
        </motion.div>

        <div className="space-y-3 mb-8">
          {replies.length === 0 ? (
            <p className="text-center text-muted-foreground py-8 text-sm">
              No replies yet - be the first to respond!
            </p>
          ) : (
            replies.map((reply, index) => (
              <motion.div
                key={reply.id}
                initial={{ opacity: 0, y: 8 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: index * 0.05 }}
                className="bg-card/40 border border-border/40 rounded-2xl p-5"
              >
                <div className="flex items-center gap-3 mb-3">
                  <div className="w-8 h-8 rounded-full bg-secondary flex items-center justify-center text-muted-foreground font-bold text-xs">
                    {(reply.author_name || "A")[0].toUpperCase()}
                  </div>
                  <div>
                    <p className="text-sm font-semibold text-foreground">{reply.author_name || "Anonymous"}</p>
                    <p className="text-xs text-muted-foreground">
                      {new Date(reply.created_date).toLocaleDateString("en-US", {
                        month: "short",
                        day: "numeric",
                      })}
                    </p>
                  </div>
                </div>
                <p className="text-sm text-muted-foreground leading-relaxed">{reply.body}</p>
              </motion.div>
            ))
          )}
        </div>

        <form
          onSubmit={handleReplySubmit}
          className="bg-card/60 backdrop-blur-xl border border-border/50 rounded-3xl p-6 md:p-8 space-y-4"
        >
          <div>
            <h2 className="font-heading text-xl font-bold text-foreground">Post a reply</h2>
            <p className="text-sm text-muted-foreground mt-1">
              Add your answer or follow-up to the thread.
            </p>
          </div>

          {!user && (
            <Input
              value={replyAuthorName}
              onChange={(e) => setReplyAuthorName(e.target.value)}
              placeholder="Your name (optional)"
              className="h-11"
            />
          )}

          <Textarea
            value={replyBody}
            onChange={(e) => setReplyBody(e.target.value)}
            placeholder="Write your reply..."
            className="min-h-32 resize-y"
          />

          <div className="flex items-center justify-between gap-4 flex-wrap">
            <p className="text-sm text-muted-foreground">
              Replying as <span className="text-foreground font-medium">{resolvedAuthorName}</span>
            </p>
            <Button type="submit" disabled={isSubmittingReply}>
              <Send className="w-4 h-4 mr-2" />
              {isSubmittingReply ? "Posting..." : "Post Reply"}
            </Button>
          </div>
        </form>
      </div>
    </div>
  );
}
