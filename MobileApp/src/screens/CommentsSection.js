// MobileApp/src/screens/CommentsSection.js
import React, { useEffect, useState, useCallback } from 'react';
import {
  View,
  Text,
  FlatList,
  TextInput,
  TouchableOpacity,
  StyleSheet,
  ActivityIndicator,
  Alert
} from 'react-native';
import moment from 'moment';

// --------------------------------------------------
// 1) Extracted CommentItem into its own function
// --------------------------------------------------
function CommentItem({ item, eventId, userId, onReplySuccess, organizerId, eventDate }) {
  const [replyText, setReplyText] = useState('');
  const [replying, setReplying] = useState(false);

  const handleReply = async () => {
    if (!replyText.trim()) return Alert.alert('Reply empty');
    setReplying(true);
    try {
      const res = await fetch(
        `http://10.0.2.2:8080/events/${eventId}/comments/${item.id}/reply`,
        {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ userId, content: replyText })
        }
      );
      if (!res.ok) throw new Error('Reply failed');
      setReplyText('');
      onReplySuccess();              // tell parent to reload
    } catch (err) {
      Alert.alert('Error', err.message);
    } finally {
      setReplying(false);
    }

  };
  // ─── pin/unpin handler
    const handlePin = async () => {
        const res = await fetch(
          `http://10.0.2.2:8080/events/${eventId}/comments/${item.id}/pin?userId=${userId}`,
          { method:'POST' }
        );
        console.log('PIN response status:', res.status);
          if (!res.ok) {
            const msg = await res.text();
            return Alert.alert('Pin failed', msg);
          }
          onReplySuccess();  // reload
        };

    // ─── reaction handler
    const handleReact = async (type) => {
      await fetch(
        `http://10.0.2.2:8080/events/${eventId}/comments/${item.id}/reactions`,
        {
          method:'POST',
          headers:{'Content-Type':'application/json'},
          body: JSON.stringify({ userId, type })
        }
      );
      onReplySuccess();
    };

  return (
    <View style={[
           styles.comment,
           item.isOrganizerReply && { backgroundColor: '#f0f8ff' } // highlight
    ]}>
        {userId === organizerId && (
            <TouchableOpacity onPress={handlePin} style={styles.pinBtn}>
              <Text>{item.pinned ? '📌 Unpin' : '📌 Pin'}</Text>
            </TouchableOpacity>
        )}
      <View style={styles.headerRow}>
        <Text style={styles.header}>
          {item.authorName}
        </Text>

        {/* Organizer badge */}
        {item.isOrganizerReply && <Text style={styles.badge}>ORG</Text>}

        {/* Pinned badge */}
        {item.pinned && <Text style={styles.pinBadge}>📌 Pinned</Text>}

        <Text style={styles.time}> · {moment(item.createdAt).fromNow()}</Text>
      </View>
     {/* Comment content */}
      <Text style={styles.content}>
        {item.content}
      </Text>
      {/* Reply input */}
      <TextInput
        style={styles.replyInput}
        placeholder="Write a reply..."
        value={replyText}
        onChangeText={setReplyText}
        editable={!replying}
        onSubmitEditing={handleReply}
      />
      <TouchableOpacity style={styles.replyBtn} onPress={handleReply} disabled={replying}>
        <Text>{replying ? '...' : 'Reply'}</Text>
      </TouchableOpacity>

      {/* Render threaded replies */}
      {item.replies.map(r => (
        <View key={r.id} style={styles.reply}>
          <Text style={styles.replyHeader}>
            {r.authorName}
            {r.isOrganizerReply && <Text style={styles.badge}>ORG</Text>}
            <Text style={styles.time}> · {moment(r.createdAt).fromNow()}</Text>
          </Text>
          <Text>{r.content}</Text>
        </View>
      ))}


      {/* ─── Emoji reactions */}
      <View style={styles.reactions}>
       <TouchableOpacity onPress={()=>handleReact('THUMBS_UP')}>
          <Text>👍 {item.thumbsUpCount}</Text>
        </TouchableOpacity>
        <TouchableOpacity onPress={()=>handleReact('HEART')}>
          <Text>❤️ {item.heartCount}</Text>
        </TouchableOpacity>
        <TouchableOpacity onPress={()=>handleReact('LAUGH')}>
          <Text>😂 {item.laughCount}</Text>
        </TouchableOpacity>
      </View>
    </View>
  );
}

// --------------------------------------------------
// 2) Main CommentsSection component
// --------------------------------------------------
export default function CommentsSection({ eventId, userId, organizerId, eventDate }) {
  const [comments, setComments] = useState([]);
  const [page, setPage]         = useState(0);
  const [loading, setLoading]   = useState(false);
  const [newText, setNewText]   = useState('');
  const [posting, setPosting]   = useState(false);

  // Reload comments when `page` or after a post/reply
  const loadComments = useCallback(async () => {
    setLoading(true);
    try {
      const res = await fetch(
        `http://10.0.2.2:8080/events/${eventId}/comments?page=${page}&size=20`
      );
      if (!res.ok) throw new Error('Failed to load');
      const data = await res.json();
      setComments(prev => (page === 0 ? data.content : [...prev, ...data.content]));
    } catch (err) {
      Alert.alert('Error', err.message);
    } finally {
      setLoading(false);
    }
  }, [eventId, page]);

  useEffect(() => {
    loadComments();
  }, [loadComments]);

  // Post a brand-new top-level comment
  const postComment = async () => {
    if (!newText.trim()) return Alert.alert('Cannot post empty');
    setPosting(true);
    try {
      const res = await fetch(`http://10.0.2.2:8080/events/${eventId}/comments`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ userId, content: newText })
      });
      if (!res.ok) throw new Error('Post failed');
      setNewText('');
      setPage(0);            // reset to first page
    } catch (err) {
      Alert.alert('Error', err.message);
    } finally {
      setPosting(false);
    }
  };

  return (
    <View style={{ flex: 1 }}>
      {/* Countdown (if you want) */}
      <Text style={styles.countdown}>
        Event in {moment(eventDate).diff(moment(), 'days')} days
      </Text>

      {/* New comment input */}
      <View style={styles.newComment}>
        <TextInput
          style={styles.newInput}
          placeholder="Write a comment..."
          value={newText}
          onChangeText={setNewText}
          editable={!posting}
          onSubmitEditing={postComment}
        />
        <TouchableOpacity style={styles.sendBtn} onPress={postComment} disabled={posting}>
          <Text>{posting ? '...' : 'Send'}</Text>
        </TouchableOpacity>
      </View>

      {/* List of comments */}
      <FlatList
        removeClippedSubviews={false}
        data={comments}
        keyExtractor={c => c.id.toString()}
        renderItem={({ item }) => (
          <CommentItem
            item={item}
            eventId={eventId}
            userId={userId}
            organizerId={organizerId}
            onReplySuccess={() => setPage(0)}
          />
        )}
        onEndReached={() => setPage(p => p + 1)}
        onEndReachedThreshold={0.5}
        ListFooterComponent={loading && <ActivityIndicator style={{ margin: 10 }} />}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  countdown: { fontSize: 14, color: '#666', margin: 8 },

  newComment: { flexDirection: 'row', padding: 8, alignItems: 'center' },
  newInput:    { flex: 1, borderWidth: 1, borderColor: '#ccc', borderRadius: 4, padding: 8 },
  sendBtn:     { marginLeft: 8 },

  comment:   { padding: 10, borderBottomWidth: 1, borderColor: '#eee' },
  header:    { fontWeight: 'bold' },
  time:      { color: '#888', fontSize: 12 },
  content:   { marginVertical: 6 },

  // reply input inside each comment
  replyInput: { borderWidth: 1, borderColor: '#ddd', borderRadius: 3, padding: 6, marginTop: 6 },
  replyBtn:   { alignSelf: 'flex-end', marginTop: 4 },

  // nested replies styling
  reply:       { paddingLeft: 16, marginTop: 8 },
  replyHeader: { fontWeight: '600' },

  badge: { backgroundColor: '#FFD700', padding: 2, marginLeft: 4, borderRadius: 3 },
  pinBtn: {
    position: 'absolute',
    top: 10,
    right: 10,
    zIndex: 2,               // << important to make it clickable above everything
    backgroundColor: 'white', // optional for visibility
    padding: 4,
    borderRadius: 5,
  },
});
