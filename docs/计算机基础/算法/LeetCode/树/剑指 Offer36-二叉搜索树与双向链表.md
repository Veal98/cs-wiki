### 剑指 Offer 36. 二叉搜索树与双向链表

[剑指 Offer 36. 二叉搜索树与双向链表 — Medium](https://leetcode-cn.com/problems/er-cha-sou-suo-shu-yu-shuang-xiang-lian-biao-lcof/)

【题目描述】输入一棵二叉搜索树，将该二叉搜索树转换成一个排序的循环双向链表。要求不能创建任何新的节点，只能调整树中节点指针的指向。

为了让您更好地理解问题，以下面的二叉搜索树为例：

 ![img](https://assets.leetcode.com/uploads/2018/10/12/bstdlloriginalbst.png)

 

我们希望将这个二叉搜索树转化为双向循环链表。链表中的每个节点都有一个前驱和后继指针。对于双向循环链表，第一个节点的前驱是最后一个节点，最后一个节点的后继是第一个节点。

下图展示了上面的二叉搜索树转化成的链表。“head” 表示指向链表中有最小元素的节点。

![img](https://assets.leetcode.com/uploads/2018/10/12/bstdllreturndll.png)

特别地，我们希望可以就地完成转换操作。当转化完成以后，树中节点的左指针需要指向前驱，树中节点的右指针需要指向后继。还需要返回链表中的第一个节点的指针。

【解题思路】要把一个二叉树转换成有序的，那显然需要中序遍历，因为中序遍历的结果就是升序的。我们把中序遍历的结果存到队列中，然后从队列中依次取出这些元素组成循环双链表就行了。

```java
/*
// Definition for a Node.
class Node {
    public int val;
    public Node left;
    public Node right;

    public Node() {}

    public Node(int _val) {
        val = _val;
    }

    public Node(int _val,Node _left,Node _right) {
        val = _val;
        left = _left;
        right = _right;
    }
};
*/
class Solution {
    public Node treeToDoublyList(Node root) {
        if (root == null) {
            return null;
        }
        
        // 从队列中依次取出节点，构建循环双链表
        Queue<Node> queue = new LinkedList<>();
        queue = inorder(root);
        
       
        Node head = queue.poll(); // 链表头
        Node pre = head; // 前置节点
        Node cur = head; // 工作指针
            
        while (!queue.isEmpty()) {
            cur = queue.poll();
            cur.left = pre;
            pre.right = cur;
            pre = cur;
        }
        
        // 成环
        head.left = pre;
        pre.right = head;

        
        return head;
    }
    
    // 非递归中序遍历(将中序遍历结果放入队列中)
    private Queue<Node> inorder(Node root) {
        
        Queue<Node> res = new LinkedList<>();
        
        if (root == null) {
            return res;
        }
        
        Stack<Node> stack = new Stack<>(); // 栈
        
        Node p = root;
        
        while (p != null || !stack.isEmpty()) {
            if (p != null) {
                stack.push(p);
                p = p.left;
            }
            else {
                p = stack.pop();
                res.offer(p);
                p = p.right;
            }
        }
        
        return res;
        
    }
}
```

